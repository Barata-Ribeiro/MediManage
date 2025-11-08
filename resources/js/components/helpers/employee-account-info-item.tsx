import HeadingSmall from '@/components/heading-small';
import { Item, ItemContent, ItemHeader } from '@/components/ui/item';
import { User } from '@/types/admin/users';
import { format } from 'date-fns';

interface EmployeeInfoItemProps {
    account: User;
}

export default function EmployeeAccountInfoItem({ account }: Readonly<EmployeeInfoItemProps>) {
    const formatedCreatedAt = format(String(account.created_at), 'PPP p');
    const formatedUpdatedAt = format(String(account.updated_at), 'PPP p');

    const formatedEmailVerifiedAt = account.email_verified_at
        ? format(String(account.email_verified_at), 'PPP p')
        : null;

    const formatedTwoFactorConfirmedAt = account.two_factor_confirmed_at
        ? format(String(account.two_factor_confirmed_at), 'PPP p')
        : null;

    const createdAtLabel = `Created at ${formatedCreatedAt}`;
    const updatedAtLabel = `Last updated at ${formatedUpdatedAt}`;

    return (
        <Item variant="outline">
            <ItemHeader>
                <HeadingSmall title="Account Info" description="The account details of the employee." />
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

                    <div>
                        <dt>Email verified</dt>
                        <dd>
                            {formatedEmailVerifiedAt ? (
                                <time
                                    dateTime={String(account.email_verified_at)}
                                    aria-label={`Email verified at ${formatedEmailVerifiedAt}`}
                                    title={`Email verified at ${formatedEmailVerifiedAt}`}
                                >
                                    {formatedEmailVerifiedAt}
                                </time>
                            ) : (
                                <span className="text-balance">—</span>
                            )}
                        </dd>
                    </div>

                    <div>
                        <dt>Two-factor confirmed</dt>
                        <dd>
                            {formatedTwoFactorConfirmedAt ? (
                                <time
                                    dateTime={String(account.two_factor_confirmed_at)}
                                    aria-label={`Two-factor confirmed at ${formatedTwoFactorConfirmedAt}`}
                                    title={`Two-factor confirmed at ${formatedTwoFactorConfirmedAt}`}
                                >
                                    {formatedTwoFactorConfirmedAt}
                                </time>
                            ) : (
                                <span className="text-balance">—</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </ItemContent>
        </Item>
    );
}
