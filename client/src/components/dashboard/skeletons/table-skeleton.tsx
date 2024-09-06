export default function TableSkeleton() {
    return (
        <div role="status" className="animate-pulse px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 md:justify-between">
                <div className="w-max flex-auto">
                    <p className="mb-4 h-3 w-48 rounded-full bg-gray-200"></p>
                    <p className="mb-2.5 h-2 max-w-[380px] rounded-full bg-gray-300"></p>
                    <p className="mb-2.5 h-2 max-w-[340px] rounded-full bg-gray-200"></p>
                    <p className="mb-2.5 h-2 max-w-[320px] rounded-full bg-gray-300"></p>
                </div>

                <div className="order-1 flex flex-wrap justify-center gap-2 sm:order-2 sm:justify-normal">
                    <div className="h-8 w-24 rounded-full bg-gray-200"></div>
                    <div className="h-8 w-40 rounded-full bg-gray-300"></div>
                    <div className="h-8 w-48 rounded-full bg-gray-200"></div>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        <div className="h-4 w-1/3 rounded bg-gray-400"></div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                                        <div className="h-4 w-1/3 rounded bg-gray-500"></div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                                        <div className="h-4 w-1/3 rounded bg-gray-400"></div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-3 pr-4 text-right text-sm backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                        <div className="h-4 w-1/3 rounded bg-gray-500"></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 10 }).map((_, idx) => (
                                    <tr key={`idx-${idx}`}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 lg:pl-8">
                                            <div className="h-4 w-1/4 rounded bg-gray-300"></div>
                                        </td>
                                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-900 sm:table-cell">
                                            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                            <div className="h-4 w-1/4 rounded bg-gray-300"></div>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6 lg:pr-8">
                                            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mx-4 mt-4 h-10 rounded bg-gray-300 sm:mx-6 lg:mx-8"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
