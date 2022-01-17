module.exports = class ApiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    
    // query is the data from DB
   // queryString is req.query 

    filter(){
        const queryObj = {...this.queryString}

        // delete extra element from query to filter
            const excludeEle = ['sort','fields',"page","limit"];
            excludeEle.forEach(ele =>{
                    delete queryObj[ele]
                })
            
        // Advanced filtering in query
            let queryStr = JSON.stringify(queryObj)
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
                
           this.query = this.query.find(JSON.parse(queryStr))

            return this;

    }

    sort(){
        // Sorting in the data
            if(this.queryString.sort){
                const sortBy = this.queryString.sort.split(",").join(" ");
                // sort by ascending
                this.query =this.query.sort(sortBy)
            }else{
                // sort by decending by(-)
                this.query= this.query.sort("-date")
            }
            return this
    }

    limit(){
        if(this.queryString.fields){
            // visible only fields data in the output
            const fields = this.queryString.fields.split(",").join(" ")
            this.query = this.query.select(fields);
        }else{
            // hide selected data from the output by (-)in select
            this.query = this.query.select("-__v")
        }
        return this

    }

    pagination(){
        const page = ( parseInt(this.queryString.page)) || 1;
        const limit= (parseInt(this.queryString.limit)) || 100;
        const skippedPage = (page - 1) * limit;
        
        this.query= this.query.skip(skippedPage).limit(limit);
        
        return this
    }
}