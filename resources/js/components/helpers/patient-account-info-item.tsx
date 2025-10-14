import HeadingSmall from '@/components/heading-small';
import { Item, ItemContent, ItemHeader } from '@/components/ui/item';
import { User } from '@/types/admin/users';
import { format } from 'date-fns';

interface PatientInfoInfoItemProps {
    account: User;
}

export default function PatientAccountInfoItem({ account }: Readonly<PatientInfoInfoItemProps>) {
    const formatedCreatedAt = format(String(account.created_at), 'PPP p');
    const formatedUpdatedAt = format(String(account.updated_at), 'PPP p');

    const createdAtLabel = `Created at ${formatedCreatedAt}`;
    const updatedAtLabel = `Last updated at ${formatedUpdatedAt}`;

    return (
        <Item variant="outline">
            <ItemHeader>
                <HeadingSmall title="Account Info" description="The account details of the patient." />
            </ItemHeader>

            <ItemContent>
                <dl
                    aria-labelledby="account-info"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&>div>dd]:font-mono [&>div>dd]:text-sm [&>div>dt]:text-sm [&>div>dt]:font-semibold [&>div>dt]:text-muted-foreground"
                >
                    <div>
                        <dt>ID</dt>
                        <dd>{account.id}</dd>
                    </div>

                    <div>
                        <dt>Username</dt>
                        <dd>{account.name}</dd>
                    </div>

                    <div>
                        <dt>Email</dt>
                        <dd>
                            <a
                                href={`mailto:${account.email}`}
                                className="break-all underline"
                                aria-label={`Email ${account.name}`}
                            >
                                {account.email}
                            </a>
                        </dd>
                    </div>

                    <div>
                        <dt>Bio</dt>
                        <dd className="text-balance">{account.bio ?? '—'}</dd>
                    </div>

                    <div>
                        <dt>Created</dt>
                        <dd>
                            <time
                                dateTime={String(account.created_at)}
                                aria-label={createdAtLabel}
                                title={createdAtLabel}
                            >
                                {formatedCreatedAt}
                            </time>
                        </dd>
                    </div>

                    <div>
                        <dt>Updated</dt>
                        <dd>
                            <time
                                dateTime={String(account.updated_at)}
                                aria-label={updatedAtLabel}
                                title={updatedAtLabel}
                            >
                                {formatedUpdatedAt}
                            </time>
                        </dd>
                    </div>
                </dl>
            </ItemContent>
        </Item>
    );
}
