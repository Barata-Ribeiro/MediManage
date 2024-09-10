import { Prescription } from "@/interfaces/prescriptions"
import parseDate from "@/utils/parse-date"
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

interface PrescriptionPdfProps {
    data: Prescription
}

const styles = StyleSheet.create({
    page: {
        padding: 35,
    },
    wrapper: {
        flexDirection: "column",
        height: "100%",
        padding: 10,
        border: "2px solid #46E861",
    },
    mainTitle: {
        fontFamily: "Courier-Bold",
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
        color: "#124FC9",
    },
    header: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        marginTop: 20,
        marginBottom: 10,
        paddingBottom: 10,
        borderBottom: "2px solid #46E861",
    },
    subTitle: {
        fontFamily: "Courier-Bold",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        color: "#929499",
    },
    subText: {
        fontSize: 10,
        textAlign: "center",
        color: "#BABBBF",
    },
    doctorReg: {
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 10,
    },
    regWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 2,
    },
    info: {
        fontSize: 12,
        textAlign: "center",
        color: "#929499",
    },
    patientWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    prescriptionWrapper: {
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 10,
    },
    prescription: {
        alignSelf: "flex-start",
        fontSize: 16,
        textAlign: "left",
        color: "#222426",
        marginTop: 10,
    },
    footer: {
        position: "absolute",
        fontSize: 12,
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "#929499",
    },
    pageNumber: {
        position: "absolute",
        fontSize: 12,
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
    },
})

function getAge(birthday: string) {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--

    return age
}

export default function PrescriptionPdf({ data }: PrescriptionPdfProps) {
    const institution = process.env.INSTITUTION_NAME
    console.log(data)
    return (
        <Document
            title={`Prescription for ${data.patient.fullName} by Dr. ${data.doctor.fullName} - ${parseDate(data.createdAt)}`}
            author={data.doctor.fullName!}
            subject={data.patient.fullName!}
            keywords={[data.doctor.fullName!, data.patient.fullName!, "prescription"].join(", ")}
            language="en">
            <Page size="A4" style={styles.page} wrap={false}>
                <view style={styles.wrapper}>
                    <Text style={styles.mainTitle} fixed>
                        {institution}
                    </Text>

                    <View style={styles.header}>
                        <Text style={styles.subTitle}>{data.doctor.fullName}</Text>
                        <Text style={styles.subText}>@{data.doctor.username}</Text>
                        <View style={styles.doctorReg}>
                            <View style={styles.regWrapper}>
                                <Text style={styles.info}>Reg No: {data.doctor.registrationNumber}</Text>
                                <Text style={styles.info}>Origin: {data.doctor.registrationOrigin}</Text>
                            </View>
                            <Text style={styles.info}>Speciality: {data.doctor.specialization}</Text>
                        </View>
                        <Text style={styles.info}>Email - {data.doctor.email}</Text>
                        <Text style={styles.info}>Phone - {data.doctor.phone}</Text>
                    </View>

                    <View style={styles.patientWrapper}>
                        <Text style={styles.info}>Patient Name: {data.patient.fullName}</Text>
                        <Text style={styles.info}>Age: {getAge(data.patient.birthDate!)}</Text>
                        <Text style={styles.info}>Birthdate: {parseDate(data.patient.birthDate)}</Text>
                        <Text style={styles.info}>Phone: {data.patient.phone}</Text>
                        <Text style={styles.info}>Address: {data.patient.address}</Text>
                        <Text style={styles.info}>Email: {data.patient.email}</Text>
                    </View>

                    <View style={styles.prescriptionWrapper}>
                        <Text style={styles.subTitle}>Prescription</Text>
                        <Text style={styles.info}>{parseDate(data.createdAt)}</Text>

                        <Text style={styles.prescription}>{data.text}</Text>
                    </View>

                    <view style={styles.footer}>
                        <Text style={styles.info}>
                            This prescription is valid for 7 days by default from the date of issue. Unless specified
                            otherwise by the doctor in this same prescription.
                        </Text>
                        <Text style={styles.info}>Powered by {institution}</Text>
                    </view>
                </view>
                <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                    fixed
                />
            </Page>
        </Document>
    )
}
