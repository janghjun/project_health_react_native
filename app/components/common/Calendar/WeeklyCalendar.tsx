import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from 'date-fns';

export default function WeeklyCalendar({
  selectedDate,
  onSelectDate,
  markedDates = {},
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markedDates?: { [dateStr: string]: boolean };
}) {
  const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const end = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  return (
    <View style={styles.container}>
      <View style={styles.weekRow}>
        {days.map((day, idx) => {
          const dayLabel = format(day, 'EEE'); // 'Sun', 'Mon', ...
          const dateLabel = format(day, 'd'); // '1', '2', ...
          const dateStr = format(day, 'yyyy-MM-dd');
          const isMarked = markedDates?.[dateStr];
          const isSelected = isSameDay(day, selectedDate);

          return (
            <TouchableOpacity
              key={idx}
              style={styles.dayWrapper}
              onPress={() => onSelectDate(day)}
            >
              <Text style={styles.dayLabel}>{dayLabel}</Text>
              <View style={[styles.dateCircle, isSelected && styles.selectedCircle]}>
                <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                  {dateLabel}
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
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#F05636',
  },
  dateText: {
    fontSize: 14,
    color: '#000',
  },
  selectedText: {
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