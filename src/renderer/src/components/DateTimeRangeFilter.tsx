import { Input } from './ui'

interface DateTimeRange {
  startDate: string
  startTime: string
  endDate: string
  endTime: string
}

interface DateTimeRangeFilterProps {
  value: DateTimeRange
  onChange: (value: DateTimeRange) => void
}

export function DateTimeRangeFilter({
  value,
  onChange
}: DateTimeRangeFilterProps): React.JSX.Element {
  const update = (field: keyof DateTimeRange, newValue: string): void => {
    const updates: Partial<DateTimeRange> = { [field]: newValue }
    if (field === 'startDate') {
      updates.endDate = newValue
    }
    onChange({ ...value, ...updates })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Input
          type="date"
          value={value.startDate}
          onChange={(e) => update('startDate', e.target.value)}
        />
        <Input
          type="time"
          value={value.startTime}
          onChange={(e) => update('startTime', e.target.value)}
        />
      </div>
      <span className="text-zinc-500">-</span>
      <div className="flex items-center gap-1">
        <Input
          type="date"
          value={value.endDate}
          onChange={(e) => update('endDate', e.target.value)}
        />
        <Input
          type="time"
          value={value.endTime}
          onChange={(e) => update('endTime', e.target.value)}
        />
      </div>
    </div>
  )
}

export type { DateTimeRange }
