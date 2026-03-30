import dayjs from 'dayjs'

export function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD')
}

export function formatRelativeTime(date) {
  return dayjs(date).fromNow()
}