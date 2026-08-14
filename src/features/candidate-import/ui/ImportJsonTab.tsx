import { TabsContent } from '@/shared/ui/tabs'
import { Label } from '@/shared/ui/label'

export function ImportJsonTab({ jsonData, onChange }: { jsonData: string; onChange: (v: string) => void }) {
  return (
    <TabsContent value="json" className="space-y-3 pt-3">
      <div>
        <Label htmlFor="jsonData">JSON Data</Label>
        <textarea
          id="jsonData"
          className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono mt-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={`[\n  {\n    "surname": "Doe",\n    "firstname": "John",\n    "sessionId": "...",\n    "subjects": ["..."]\n  }\n]`}
          value={jsonData}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </TabsContent>
  )
}
