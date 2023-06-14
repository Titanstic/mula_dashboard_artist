const checkArtSeriesInput = (data) => {
    let errorExist = false;
    const tempErrors = {};

    if (!data.series_name) {
        tempErrors.series_name = "Name is required.";
        errorExist = true;
    }

    return { errorExist, tempErrors };

};

export { checkArtSeriesInput };