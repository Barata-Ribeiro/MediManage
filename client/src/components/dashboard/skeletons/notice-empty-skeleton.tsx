import { BiFileBlank } from "react-icons/bi"

export default function NoticeEmptySkeleton() {
    return (
        <div className="relative block w-full select-none rounded-md bg-neutral-200 px-12 py-32 text-center">
            <BiFileBlank className="mx-auto h-12 w-12 text-neutral-600" />
            <h3 className="mt-2 font-heading font-semibold text-neutral-900">No Recent Notice</h3>
            <p className="mt-1 text-sm text-neutral-700">
                No notices to display now.
                <br />
                Check back later.
            </p>
        </div>
    )
}
