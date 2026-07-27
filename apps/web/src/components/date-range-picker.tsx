import { useEffect, useMemo, useState } from "react"
import { format, startOfDay, subDays } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"
import { CalendarDays } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { createDefaultDashboardDateRange, type DashboardDateRange } from "../dashboard-mock-data"
import type { Locale } from "../i18n"
import { useIsMobile } from "../hooks/use-mobile"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

type DateRangePickerProps = {
  locale: Locale
  value: DashboardDateRange
  onChange: (range: DashboardDateRange) => void
}

const presetDays = [7, 28, 90, 365] as const

function formatRange(value: DashboardDateRange, pattern: string, locale: Locale) {
  const dateLocale = locale === "zh" ? zhCN : enUS
  return `${format(value.from, pattern, { locale: dateLocale })} – ${format(value.to, pattern, { locale: dateLocale })}`
}

export function DateRangePicker({ locale, value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>({ from: value.from, to: value.to })
  const isMobile = useIsMobile()
  const today = useMemo(() => startOfDay(new Date()), [])
  const copy = locale === "zh"
    ? {
        label: "时间区间",
        custom: "自定义区间",
        cancel: "取消",
        apply: "应用",
        mock: "Mock 数据",
        mockShort: "Mock",
        preset: (days: number) => days === 365 ? "最近 1 年" : `最近 ${days} 天`,
      }
    : {
        label: "Date range",
        custom: "Custom range",
        cancel: "Cancel",
        apply: "Apply",
        mock: "Mock data",
        mockShort: "Mock",
        preset: (days: number) => days === 365 ? "Last year" : `Last ${days} days`,
      }

  useEffect(() => {
    if (!open) setDraft({ from: value.from, to: value.to })
  }, [open, value])

  function selectPreset(days: number) {
    const range = createDefaultDashboardDateRange(today)
    onChange({ from: subDays(range.to, days - 1), to: range.to })
    setOpen(false)
  }

  function applyDraft() {
    if (!draft?.from || !draft.to) return
    onChange({ from: draft.from, to: draft.to })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="kit-date-range-trigger"
          data-testid="date-range-trigger"
          variant="outline"
          aria-label={`${copy.label}: ${formatRange(value, "PPP", locale)}. ${copy.mock}`}
        >
          <CalendarDays aria-hidden="true" />
          <span className="kit-date-range-full">{formatRange(value, "yyyy/MM/dd", locale)}</span>
          <span className="kit-date-range-compact">{formatRange(value, "MM/dd", locale)}</span>
          <small>{copy.mockShort}</small>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={12}
        className="kit-date-range-popover w-auto max-w-[calc(100vw-1.5rem)] p-0"
        data-testid="date-range-popover"
      >
        <div className="kit-date-range-head">
          <div>
            <span>{copy.label}</span>
            <strong>{copy.custom}</strong>
          </div>
          <span className="kit-mock-source"><i />{copy.mock}</span>
        </div>
        <div className="kit-date-presets" aria-label={copy.label}>
          {presetDays.map((days) => (
            <Button key={days} type="button" variant="outline" size="sm" onClick={() => selectPreset(days)}>
              {copy.preset(days)}
            </Button>
          ))}
        </div>
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={draft?.from}
          selected={draft}
          onSelect={setDraft}
          numberOfMonths={isMobile ? 1 : 2}
          disabled={{ after: today }}
          locale={locale === "zh" ? zhCN : enUS}
        />
        <div className="kit-date-range-footer">
          <span aria-live="polite">
            {draft?.from && draft.to ? formatRange({ from: draft.from, to: draft.to }, "PP", locale) : copy.custom}
          </span>
          <div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>{copy.cancel}</Button>
            <Button type="button" size="sm" disabled={!draft?.from || !draft.to} onClick={applyDraft}>{copy.apply}</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
