import prismaSchema from '../prismaClient.js';
import { AppError } from '@flextest/apperrorhandler';
import { HttpStatusCode } from 'axios';

class CandidateRepository {
    #model;

    constructor(model = prismaSchema.Candidate) {
        this.#model = model;
    }

    /**
     * Create a single candidate record.
     * @param {Object} data - Candidate data
     * @returns {Promise<Object>}
     */
    async createCandidate(data) {
        try {
            return await this.#model.create({ data });
        } catch (error) {
            throw new AppError(HttpStatusCode.InternalServerError, error.message || 'Failed to create candidate');
        }
    }

    /**
     * Bulk insert multiple candidates.
     * @param {Array<Object>} data - List of candidate records
     * @returns {Promise<Object>}
     */
    async createManyCandidates(data) {
        try {
            return await this.#model.createMany({ data });
        } catch (error) {
            throw new AppError(HttpStatusCode.InternalServerError, error.message || 'Failed to create candidates');
        }
    }

    /**
     * Retrieve a candidate by ID.
     * @param {number} id - Candidate ID
     * @returns {Promise<Object>}
     */
    async getCandidateById(id) {
        try {
            const candidate = await this.#model.findUnique({ where: { id } });
            if (!candidate) throw new AppError(HttpStatusCode.NotFound, 'Candidate not found');
            return candidate;
        } catch (error) {
            throw new AppError(HttpStatusCode.InternalServerError, error.message || 'Error fetching candidate');
        }
    }

    /**
     * Update candidate details.
     * @param {number} id - Candidate ID
     * @param {Object} data - Fields to update
     * @returns {Promise<Object>}
     */
    async updateCandidate(id, data) {
        try {
            return await this.#model.update({ where: { id }, data });
        } catch (error) {
            throw new AppError(HttpStatusCode.InternalServerError, error.message || 'Error updating candidate');
        }
    }

    /**
     * Delete a candidate by ID.
     * @param {number} id - Candidate ID
     * @returns {Promise<Object>}
     */
    async deleteCandidate(id) {
        try {
            return await this.#model.delete({ where: { id } });
        } catch (error) {
            throw new AppError(HttpStatusCode.InternalServerError, error.message || 'Error deleting candidate');
        }
    }

    /**
     * List all candidates with optional filtering.
     * @param {Object} filter - Query filter (optional)
     * @returns {Promise<Array<Object>>}
     */
    async listCandidates(filter = {}) {
        try {
            return await this.#model.findMany({ where: filter });
        } catch (error) {
            throw new AppError(HttpStatusCode.InternalServerError, error.message || 'Error fetching candidates');
        }
    }
}

export default CandidateRepository;
