// import { HttpStatusCode } from 'axios';
// import { AppError } from '@flextest/apperrorhandler';
// import SubjectRepository from '../repositories/subjectRepository.js';
// import AxiosService from './axiosService.js';
// import RedisService from '../services/redisService.js';



// class SubjectService {
//     constructor() {
//         this.subjectRepository = new SubjectRepository; 
//         this.apiService = new AxiosService(process.env.APIENDPOINT);
//         this.redisService = new RedisService
//     }

//     async createSubject(subjectname, subjectid) {
//         try {
//             if (!subjectname || !subjectid) throw new AppError(HttpStatusCode.BadRequest, "Subject name and subject ID are required");

//             const existingSubject = await this.subjectRepository.getSubjectById(subjectid);
//             if (existingSubject) throw new AppError(HttpStatusCode.Conflict, "Subject with this ID already exists");

//             const newSubject = await this.subjectRepository.createSubject(subjectname, subjectid);
//             return newSubject;
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError(HttpStatusCode.InternalServerError, error.message);
//         }
//     }


//     async getSubjectById(subjectid) {
//         try {
//             if (!subjectid) throw new AppError(HttpStatusCode.BadRequest, "Subject ID is required");

//             const subjectFromRedis = await this.redisService.get(subjectid);
//             if (subjectFromRedis) {
//                 return JSON.parse(subjectFromRedis);
//             }

//             const subjectFromDB = await this.subjectRepository.getSubjectById(subjectid);
//             if (!subjectFromDB) throw new AppError(HttpStatusCode.NotFound, "Subject not found");

//             await this.storeOnRedis(subjectFromDB);

//             return subjectFromDB;
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError(error.message, HttpStatusCode.InternalServerError);
//         }
//     }


//     async getAllSubjects() {
//         try {
//             const subjects = await this.subjectRepository.getAllSubjects();
//             return subjects;
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError(HttpStatusCode.InternalServerError, error.message);
//         }
//     }

 
//     async updateSubject(subjectid, newSubjectname) {
//         try {
//             if (!subjectid || !newSubjectname) throw new AppError(HttpStatusCode.BadRequest, "Subject ID and new name are required");

//             const existingSubject = await this.subjectRepository.getSubjectById(subjectid);
//             if (!existingSubject) throw new AppError(HttpStatusCode.NotFound, "Subject not found");

//             const updatedSubject = await this.subjectRepository.updateSubject(subjectid, newSubjectname);
//             return updatedSubject;
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError(HttpStatusCode.InternalServerError, error.message);
//         }
//     }


//     async deleteSubject(subjectid) {
//         try {
//             if (!subjectid) throw new AppError(HttpStatusCode.BadRequest, "Subject ID is required");

//             const existingSubject = await this.subjectRepository.getSubjectById(subjectid);
//             if (!existingSubject) throw new AppError(HttpStatusCode.NotFound, "Subject not found");

//             const existingSubjectonRedis = await this.redisService.get(subjectid);
//             if(existingSubjectonRedis) await this.redisService.delete(subjectid);
            
//             await this.subjectRepository.deleteSubject(subjectid);
//             return true;
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError( HttpStatusCode.InternalServerError, error.message);
//         }
//     }


//     async createManySubjects(subjects) {
//         try {
//             if (!Array.isArray(subjects) || subjects.length === 0) throw new AppError(HttpStatusCode.BadRequest, "Subjects array cannot be empty");

//             const createdSubjects = await this.subjectRepository.createManySubjects(subjects);
//             return createdSubjects;
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError(HttpStatusCode.InternalServerError, error.message);
//         }
//     }


//     async importSubjectsFromAPI(apiUrl, param, token) {
//         try {
//             const response = await this.apiService.get(apiUrl, param, token);
//             this.checkApiResponse(response);
//             const subjects = this.formatSubjects(response.data);
//             const createdSubjects = await this.subjectRepository.createManySubjects(subjects);
//             return createdSubjects;
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError(HttpStatusCode.InternalServerError, error.message);
//         }
//     }

//     checkApiResponse(response) {
//         if (!response || !response.data) {
//           throw new AppError(HttpStatusCode.BadRequest, 'Invalid API response');
//         }
//     }

//     formatSubjects(subjectsFromAPI) {
//         return subjectsFromAPI.map(subject => ({
//           subjectid: subject.subjectid,
//           subjectname: subject.subjectname
//         }));
//     }

//     async storeOnRedis(subject) {
//         try {
//             const subjectString = JSON.stringify(subject);
//             await this.redisService.set(subject.subjectid, subjectString, 'EX', 300);
//         } catch (error) {
//             throw error instanceof AppError ? error : new AppError(error.message, HttpStatusCode.InternalServerError);
//         }
//     }
// }

// export default SubjectService;
