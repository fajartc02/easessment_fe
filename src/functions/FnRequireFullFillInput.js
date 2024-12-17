const FnRequireFullFillInput = (objInput) => {
  for (const key in objInput) {
    const element = objInput[key];
    if (!element) {
      console.log("not fullfill", key, element);
      return false;
    }
  }
  return true;
};

export default FnRequireFullFillInput;
