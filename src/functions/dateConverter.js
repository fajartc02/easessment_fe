const convertDate = (dateValue) => {
    const year = dateValue.split('T')[0].split('-')[0]
    const month = dateValue.split('T')[0].split('-')[1]
    const day = dateValue.split('T')[0].split('-')[2]

      return `${year}-${month}-${day}`
}

export default convertDate