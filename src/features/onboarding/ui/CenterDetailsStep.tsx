import type { ChangeEvent } from 'react'
import type { CenterData } from '../model/types'
import { StepTextField } from './StepTextField'

interface CenterDetailsStepProps {
  centerData: CenterData
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function CenterDetailsStep({ centerData, onChange }: CenterDetailsStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Configure Center Details
      </h2>
      <p className="text-gray-600 mb-6">
        Please provide your examination center information
      </p>

      <div className="space-y-5">
        <StepTextField
          name="centerName"
          label="Center Name *"
          value={centerData.centerName}
          placeholder="Enter center name"
          onChange={onChange}
        />
        <StepTextField
          name="email"
          label="Email Address *"
          type="email"
          value={centerData.email}
          placeholder="center@example.com"
          onChange={onChange}
        />
        <StepTextField
          name="phone"
          label="Phone Number *"
          type="tel"
          value={centerData.phone}
          placeholder="+234 xxx xxxx xxx"
          onChange={onChange}
        />
        <StepTextField
          name="address"
          label="Address *"
          value={centerData.address}
          placeholder="Enter center address"
          onChange={onChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <StepTextField
            name="state"
            label="State *"
            value={centerData.state}
            placeholder="State"
            onChange={onChange}
          />
          <StepTextField
            name="lga"
            label="LGA *"
            value={centerData.lga}
            placeholder="Local Government Area"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}
