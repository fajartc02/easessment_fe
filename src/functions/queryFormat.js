function queryFormat(objs) {
  console.log(objs);

    let containerQuery = []
    for (const key in objs) {
        const element = objs[key] ?? null;
        containerQuery.push(`${key}=${element}`)
    }
    console.log(containerQuery);

    return containerQuery.join('&');
}


export default queryFormat
