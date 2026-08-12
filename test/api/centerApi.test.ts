import { getAllCenters, getCenterById, createCenter, updateCenter } from '@/entities/center/api/centerApi'
import { apiClient, ApiError } from '@/shared/api/client'

describe('Center API', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getAllCenters', () => {
    it('should fetch all centers', async () => {
      const mockCenters = [
        {
          id: '1',
          centerName: 'Test Center',
          address: '123 Main St',
          phone: '123-456-7890',
          email: 'center@example.com',
          state: 'Lagos',
          lga: 'Ikeja',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        status: 200,
        data: mockCenters,
      })

      const result = await getAllCenters()

      expect(apiClient.get).toHaveBeenCalledWith('/centers')
      expect(result).toEqual(mockCenters)
    })

    it('should throw ApiError on failure', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: false,
        status: 500,
        error: { message: 'Server error', code: 'SERVER_ERROR' },
      })

      await expect(getAllCenters()).rejects.toThrow(ApiError)
    })
  })

  describe('getCenterById', () => {
    it('should fetch center by ID', async () => {
      const mockCenter = {
        id: '1',
        centerName: 'Test Center',
        address: '123 Main St',
        phone: '123-456-7890',
        email: 'center@example.com',
        state: 'Lagos',
        lga: 'Ikeja',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        status: 200,
        data: mockCenter,
      })

      const result = await getCenterById('1')

      expect(apiClient.get).toHaveBeenCalledWith('/centers/1')
      expect(result).toEqual(mockCenter)
    })
  })

  describe('createCenter', () => {
    it('should create a new center', async () => {
      const mockCenter = {
        id: '1',
        centerName: 'New Center',
        address: '456 Oak Ave',
        phone: '987-654-3210',
        email: 'new@example.com',
        state: 'Abuja',
        lga: 'Garki',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      const createData = {
        centerName: 'New Center',
        address: '456 Oak Ave',
        phone: '987-654-3210',
        email: 'new@example.com',
        state: 'Abuja',
        lga: 'Garki',
      }

      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 201,
        data: mockCenter,
      })

      const result = await createCenter(createData)

      expect(apiClient.post).toHaveBeenCalledWith('/centers', createData)
      expect(result).toEqual(mockCenter)
    })
  })

  describe('updateCenter', () => {
    it('should update center', async () => {
      const mockCenter = {
        id: '1',
        centerName: 'Updated Center',
        address: '789 Pine St',
        phone: '111-222-3333',
        email: 'updated@example.com',
        state: 'Lagos',
        lga: 'Ikeja',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      }

      jest.spyOn(apiClient, 'patch').mockResolvedValue({
        success: true,
        status: 200,
        data: mockCenter,
      })

      const result = await updateCenter('1', { centerName: 'Updated Center' })

      expect(apiClient.patch).toHaveBeenCalledWith('/centers/1', { centerName: 'Updated Center' })
      expect(result).toEqual(mockCenter)
    })
  })
})

