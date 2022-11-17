class ApiFeatures {
    constructor({queryFunction, queryStr}){
        this.queryFunction = queryFunction;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{};

        this.queryFunction = this.queryFunction.find({...keyword});
        return this;
    }

    filter(){
        let queryCopy = {...this.queryStr};

        ['keyword', 'page', 'limit'].forEach(key=> delete queryCopy[key]);


        queryCopy = JSON.stringify(queryCopy);
        queryCopy = JSON.parse(queryCopy.replace(/\b(gt|gte|lt|lte)\b/g, key=>`$${key}`));

        this.queryFunction = this.queryFunction.find(queryCopy);
        return this;
    }

    pagination(resultPerPage){

        const current = Number(this.queryStr.page)||1;

        const skip = resultPerPage*(current-1);


        this.queryFunction = this.queryFunction.skip(skip).limit(resultPerPage);

    
        return this;
    }

}


module.exports = ApiFeatures;