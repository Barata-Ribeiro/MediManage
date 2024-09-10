import getPrescriptionByIdAndUsername from "@/actions/prescriptions/get-prescription-by-id-and-username"
import { notFound } from "next/navigation"
import { renderToStream } from "@react-pdf/renderer"
import { NextResponse } from "next/server"
import PrescriptionPdf from "@/components/prescription-pdf"
import { Prescription } from "@/interfaces/prescriptions"

interface PrescriptionPageProps {
    params: { username: string; prescId: string; patientUsername: string }
}

export async function GET(req: Request, { params }: PrescriptionPageProps) {
    console.log(params)
    if (!params.username || !params.prescId || !params.patientUsername) throw new Error("Missing params.")
    if (isNaN(parseInt(params.prescId))) throw new Error("Invalid prescription Id")

    const state = await getPrescriptionByIdAndUsername({ id: params.prescId, username: params.patientUsername })
    if (!state.ok || state.error) notFound()
    const prescription = state.response?.data as Prescription

    const stream = await renderToStream(<PrescriptionPdf data={prescription} />)

    return new NextResponse(stream as unknown as ReadableStream)
}
