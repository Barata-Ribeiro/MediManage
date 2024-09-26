import { NewAccountResponse } from "@/interfaces/auth"
import parseDate from "@/utils/parse-date"
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

interface NewUserCredentialsPdfProps {
    data: NewAccountResponse
}

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        height: "100%",
        padding: 35,
    },
    wrapper: {
        flexDirection: "column",
        padding: 10,
        border: "2px solid #46E861",
    },
    mainTitle: {
        fontFamily: "Courier-Bold",
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
        color: "#2563eb",
        marginBottom: 10,
    },
    credentials: {
        color: "#030712",
        marginBottom: 15,
    },
    important: {
        fontWeight: "bold",
    },
    date: {
        fontSize: 12,
        textAlign: "center",
        color: "#9ca3af",
        marginBottom: 10,
    },
    warning: {
        fontSize: 12,
        textAlign: "center",
        color: "#dc2626",
    },
})

export default function NewUserCredentialsPdf({ data }: Readonly<NewUserCredentialsPdfProps>) {
    const institution = process.env.NEXT_PUBLIC_INSTITUTION_NAME ?? "Clinic Management System"

    return (
        <Document
            title="New Account Credentials"
            author={institution}
            subject={data.username}
            keywords={[
                "new account",
                "credentials",
                "username",
                "password",
                "clinic management system",
                institution,
            ].join(", ")}
            language="en">
            <Page size="B6" orientation="landscape" wrap={false} style={styles.page}>
                <View style={styles.wrapper}>
                    <Text style={styles.mainTitle} fixed>
                        {institution}
                    </Text>

                    <View style={styles.credentials}>
                        <Text>
                            Username: <Text style={styles.important}>{data.username}</Text>
                        </Text>
                        <Text>
                            Password: <Text style={styles.important}>{data.password}</Text>
                        </Text>
                    </View>

                    <Text style={styles.date}>{parseDate(data.registeredAt)}</Text>

                    <Text style={styles.warning}>{data.message}</Text>
                </View>
            </Page>
        </Document>
    )
}
