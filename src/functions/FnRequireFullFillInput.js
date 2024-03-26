const FnRequireFullFillInput = (objInput) => {
    for (const key in objInput) {
        const element = objInput[key];
        if (!element) {
            return false
        }
    }
    return true
}

export default FnRequireFullFillInput
