import EditNoticeForm from '@/components/forms/notices/edit-notice-form';
import Heading from '@/components/heading';
import Layout from '@/layouts/app-layout';
import notices from '@/routes/notices';
import { BreadcrumbItem } from '@/types';
import { Notice } from '@/types/application/notice';
import { Head } from '@inertiajs/react';

function Edit({ notice }: Readonly<{ notice: Notice }>) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Notices',
            href: notices.index().url,
        },
        {
            title: `Edit Notice - ${notice.title}`,
            href: notices.edit(notice.id).url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Notice: ${notice.title}`} />
            <div className="px-4 py-6">
                <Heading title="Edit Notice" description="Update the information for the notice." />

                <section className="rounded-md bg-card p-4 shadow sm:p-6">
                    <EditNoticeForm notice={notice} />
                </section>
            </div>
        </Layout>
    );
}

export default Edit;
