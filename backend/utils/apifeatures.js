const { json } = require("express");

class ApiFeatures {
    constructor(query,queryStr){
        this.query=query;             // value h property h es class m
        this.queryStr=queryStr;
    }

    // search features
    search(){
        const keyword=this.queryStr.keyword?{
          name:{
            $regex:this.queryStr.keyword,  // $ mongodb regex
            $options:"i",// case in senstive
          }
        }:{};
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy={...this.queryStr}
      
        // removing some fields for category
        const removeFields=["keyword","page","limit"];
        removeFields.forEach(key=>delete queryCopy[key])

        //Filter for price and rating

     let queryStr=JSON.stringify(queryCopy);  //convert to string
     queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)

       this.query=this.query.find(JSON.parse(queryStr)); //convert to object
       return this;

    }

    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page) || 1; // bydefault 1 page


         const skip=resultPerPage*(currentPage - 1);
         this.query=this.query.limit(resultPerPage).skip(skip);
         return this;
    }


};
module.exports=ApiFeatures