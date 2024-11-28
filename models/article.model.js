class ArticleSchema {
    constructor(
        // id, 
        name, 
        description, 
        resource, 
        image, 
        content, 
        created_at, 
        updated_at
    ) {
        // this.id = id;
        this.name = name;
        this.description = description;
        this.resource = resource;
        this.image = image;
        this.content = content;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    toJSON() {
        return {
            // id : this.id,
            name : this.name,
            description : this.description,
            resource : this.resource,
            image : this.image,
            content : this.content,
            created_at : this.created_at,
            updated_at : this.updated_at,
        };
    }
}



module.exports = ArticleSchema;