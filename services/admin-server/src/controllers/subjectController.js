// import { HttpStatusCode } from "axios";

// import handleError from "../utils/helpers/handler.js";
// import SubjectService from "../services/subjectService.js";
// import ValidationService from "../services/validationService.js";
// import { generateUniqueId, toTitleCase } from "../utils/helpers/helper.js";


//  class SubjectController {
//     constructor() {
//         this.subjectService = new SubjectService;
//         this.validationService = new ValidationService
//     }

//     async createSubject(request, response, next) {
//         try{
//             const { subjectname } = request.body;
//             await this.validationService.validateString(subjectname);
//             const subjectid = await generateUniqueId(8);
//             const newSubject = await this.subjectService.createSubject(toTitleCase(subjectname), subjectid);
//             response.status(HttpStatusCode.Created).json({
//                 token: request.token,
//                 data: newSubject
//             })
//         }catch(error) {
//             handleError(error, response, next);
//         }
//     }

//     async getSubjectById(request, response, next) {
//         try {
//             const { subjectId } = request.params;
//             await this.validationService.validateString(subjectId);
//             const subject = await this.subjectService.getSubjectById(subjectId);
//             response.status(HttpStatusCode.Ok).json({
//                 token: request.token,
//                 subject
//             });
//         }catch(error) {
//             handleError(error, response, next);
//         }
//     }

//     async getAllsubject(request, response, next) {
//         try {
//             const subjects = await this.subjectService.getAllSubjects();
//             response.status(HttpStatusCode.Ok).json({
//                 token: request.token,
//                 subjects
//             });

//         }catch(error){
//             handleError(error, response, next);
//         }
//     }

//     async updateSubject(request, response, next) {
//         try {
//             const { subjectId } = request.params;
//             const { subjectname } = request.body;
//             await this.validationService.validateUserId(subjectId);
//             await this.validationService.validateString(subjectname);
//             const updatedSubject = await this.subjectService.updateSubject(subjectId, toTitleCase(subjectname));
//             res.status(HttpStatusCode.Ok).json({
//                 token: request.token,
//                 message: 'Subject updated successfully',
//                 subject: updatedSubject
//             });
//         }catch(error){
//             handleError(error, response, next);
//         }
//     }

//     async importSubject(request, response, next) {
//         try{
//             const { apiUrl, param, userToken } = request.body;
//             await this.validationService.validateString(apiUrl);
//             await this.validationService.validateString(userToken);
//             const createdSubjects = await this.subjectService.importSubjectsFromAPI(apiUrl, param, userToken);
//             return response.status(HttpStatusCode.OK).json({
//                 message: 'Subjects imported successfully',
//                 data: createdSubjects,
//                 token: request.token
//               });

//         }catch(error) {
//             handleError(error, response, next);
//         }
//     }

//     async deleteSubject(request, response, next) {
//         try{
//             const { subjectId } = request.params
//             await this.validationService.validateString(subjectId);
//             await this.subjectService.deleteSubject(subjectId);
//             return response.status(HttpStatusCode.OK).json({
//                 message: 'Subject deleted successfully',
//                 token: request.token
//               });

//         }catch(error) {
//             handleError(error, response, next);
//         }
//     }
//  }

//  export default SubjectController;
