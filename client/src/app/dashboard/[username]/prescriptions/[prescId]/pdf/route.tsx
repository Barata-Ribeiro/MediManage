import { renderToStream } from "@react-pdf/renderer"
import { NextResponse } from "next/server"
import PrescriptionPdf from "@/components/prescription-pdf"
import { Prescription } from "@/interfaces/prescriptions"
import getMyPrescriptionById from "@/actions/prescriptions/get-my-prescription-by-id"

interface PrescriptionPageProps {
    params: { username: string; prescId: string }
}

export async function GET(req: Request, { params }: PrescriptionPageProps) {
    if (!params.username || !params.prescId) throw new Error("Missing params.")
    if (isNaN(parseInt(params.prescId))) throw new Error("Invalid prescription Id")

    const state = await getMyPrescriptionById({ id: params.prescId })
    if (!state.ok || state.error) return NextResponse.json(state.error)
    const prescription = state.response?.data as Prescription

    const stream = await renderToStream(<PrescriptionPdf data={prescription} />)

    return new NextResponse(stream as unknown as ReadableStream)
}
