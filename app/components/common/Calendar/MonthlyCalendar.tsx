import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  subMonths,
  addMonths,
} from 'date-fns';

export default function MonthlyCalendar({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  selectedDate,
  onSelectDate,
  markedDates = {},
}: {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markedDates?: { [date: string]: boolean };
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'd');
      const dateStr = format(day, 'yyyy-MM-dd');
      const isMarked = markedDates?.[dateStr];
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <TouchableOpacity
          key={day.toString()}
          style={styles.dayWrapper}
          onPress={() => onSelectDate(day)}
          disabled={!isCurrentMonth}
        >
          <View style={[styles.dayCircle, isSelected && styles.selectedCircle]}>
            <Text
              style={[
                styles.dayText,
                !isCurrentMonth && styles.outsideMonth,
                isSelected && styles.selectedDayText,
              ]}
            >
              {formattedDate}
            </Text>
          </View>
          <Text
            style={[
              styles.dot,
              isMarked === true
                ? styles.dotMarked
                : isMarked === false
                ? styles.dotUnmarked
                : styles.dotHidden,
            ]}
          >
            ●
          </Text>
        </TouchableOpacity>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <View key={day.toString()} style={styles.weekRow}>
        {days}
      </View>
    );
    days = [];
  }

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onPrevMonth}>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{format(currentMonth, 'yyyy년 MM월')}</Text>
        <TouchableOpacity onPress={onNextMonth}>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday Labels */}
      <View style={styles.weekLabelRow}>
        {['일', '월', '화', '수', '목', '금', '토'].map((label, idx) => (
          <Text key={idx} style={styles.weekLabel}>
            {label}
          </Text>
        ))}
      </View>

      {/* Calendar Dates */}
      <View>{rows}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F05636',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  weekLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#999',
    fontSize: 13,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#F05636',
  },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  outsideMonth: {
    color: '#ccc',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dot: {
    fontSize: 10,
    marginTop: 2,
  },
  dotMarked: {
    color: '#2678E4',
  },
  dotUnmarked: {
    color: '#ccc',
  },
  dotHidden: {
    color: 'transparent',
  },
});