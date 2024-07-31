const tw = (strings: readonly string[] | ArrayLike<string>, ...values: unknown[]) =>
    String.raw({ raw: strings }, ...values)

export default tw
