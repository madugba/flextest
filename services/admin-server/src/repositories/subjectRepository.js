import prismaSchema from '../prismaClient.js';

class SubjectRepository {
    constructor(model = prismaSchema.subjects) {
        this.model = model;
    }

    async createSubject(subjectname, subjectid) {
        return await this.model.create({
            data: {
                subjectid,
                subjectname
            }
        });
    }

    async getSubjectById(subjectid) {
        return await prismaSchema.subjects.findUnique({
            where: {
                subjectid
            }
        });
    }

    async getAllSubjects() {
        return await prismaSchema.subjects.findMany();
    }

    async updateSubject(subjectid, newSubjectname) {
        return await prismaSchema.subjects.update({
            where: {
                subjectid
            },
            data: {
                subjectname: newSubjectname
            }
        });
    }

    async deleteSubject(subjectid) {
        return await prismaSchema.subjects.delete({
            where: {
                subjectid
            }
        });
    }

    async createManySubjects(subjects) {
        return await prismaSchema.subjects.createMany({
            data: subjects,
            skipDuplicates: true,  
        });
    }
}

export default SubjectRepository;

