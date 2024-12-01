class DiseaseSchema {
    constructor(
        // id, 
        name, 
        description, 
        image, 
        content, 
        treatment_recommendation, 
        medicine_recommendation, 
        created_at, 
        updated_at
    ) {
        // this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.content = content;
        this.treatment_recommendation = treatment_recommendation;
        this.medicine_recommendation = medicine_recommendation;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    toJSON() {
        return {
            // id: this.id,
            name: this.name,
            description: this.description,
            image: this.image,
            content: this.content,
            treatment_recommendation: this.treatment_recommendation,
            medicine_recommendation: this.medicine_recommendation,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = DiseaseSchema;