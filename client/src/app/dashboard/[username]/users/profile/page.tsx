import { UsersPageProps } from "@/app/dashboard/[username]/users/page"
import { notFound } from "next/navigation"
import getUserProfileById from "@/actions/users/get-user-profile-by-id"
import { User } from "@/interfaces/users"
import { Metadata } from "next"
import EditAccountVitalForm from "@/components/forms/profile/edit-account-vital-form"
import EditPersonalInformationForm from "@/components/forms/profile/edit-personal-information-form"
import EditDoctorInformationForm from "@/components/forms/profile/edit-doctor-information-form"
import DeleteAccountForm from "@/components/forms/profile/delete-account-form"

export async function generateMetadata({ searchParams }: Readonly<UsersPageProps>): Promise<Metadata> {
    if (!searchParams?.id) return notFound()
    const state = await getUserProfileById(searchParams.id.toString())
    const user = state.response?.data as User

    return {
        title: `Profile of ${user.username}`,
        description: `These are the details of the user with the username ${user.username}.`,
    }
}

export default async function ViewProfilePage({ params, searchParams }: Readonly<UsersPageProps>) {
    if (!params.username || !searchParams?.id) return notFound()

    const state = await getUserProfileById(searchParams.id.toString())
    const user = state.response?.data as User

    return (
        <div className="divide-y divide-neutral-900/5">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-neutral-900">Account</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                        Change this user&apos;s account vital information.
                    </p>
                </div>

                <EditAccountVitalForm user={user} />
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-neutral-900">Personal Information</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                        Change this user&apos;s personal information.
                    </p>
                </div>

                <EditPersonalInformationForm user={user} />
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-neutral-900">Doctor Related Information</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                        Change this user&apos;s doctor related information.
                    </p>
                </div>

                <EditDoctorInformationForm user={user} />
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="font-heading text-base font-semibold leading-7 text-neutral-900">Delete account</h2>
                    <p className="mt-1 font-body text-sm leading-6 text-neutral-700">
                        Are you sure you want to delete this account? All of the user&apos;s data will be permanently
                        removed. This action cannot be undone.
                    </p>
                </div>

                <DeleteAccountForm user={user} />
            </div>
        </div>
    )
}
