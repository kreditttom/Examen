import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/header';
import Day from '../components/day';
import { MONTHS, WEEK_DAYS } from '../utils/calendar';
import { buildGrid, toDateKey } from '../utils/date';
import { fetchDatesRequest } from '../../server/api/violations';
import { useTheme } from '../context/ThemeContext';
import { fetchUnsyncedDates } from '../database';


const CalendarScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const today = new Date();
  const [date, setDate] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const [violationDates, setViolationDates] = useState([]);

  const days = buildGrid(date.year, date.month);

  useFocusEffect(
      useCallback(() => {
        const first = days[0];
        const last = days[days.length - 1];
        const from = toDateKey(first.year, first.month, first.day);
        const to = toDateKey(last.year, last.month, last.day);

        const load = async () => {
          const local = await fetchUnsyncedDates(from, to);
          const result = await fetchDatesRequest(from, to);
          const server = result.data ? result.data : [];
          setViolationDates([...new Set([...server, ...local])]);
        };
        load();
      }, [date])
  );

  const goToday = () => {
    setDate({ year: today.getFullYear(), month: today.getMonth() });
  };
  const goNext = () => {
    setDate(({ year, month }) =>
        month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );
  };
  const goPrev = () => {
    setDate(({ year, month }) =>
        month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
  };

  return (
      <View style={styles.container}>
        <View style={{ backgroundColor: colors.card }}>
          <Header
              monthName={MONTHS[date.month]}
              year={date.year}
              onToday={goToday}
              onNext={goNext}
              onPrev={goPrev}/>

          <View style={styles.weekRow}>
            {WEEK_DAYS.map((wd) => (
                <Text key={wd} style={[styles.weekDayText, { color: colors.text }]}>{wd}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {days.map((item, index) => {
              const isToday = item.current && item.day === today.getDate() && item.month === today.getMonth() && item.year === today.getFullYear();
              const key = toDateKey(item.year, item.month, item.day);

              return (
                  <Day
                      key={index}
                      day={item.day}
                      isCurrentMonth={item.current}
                      isToday={isToday}
                      hasTasks={violationDates.includes(key)}
                      onPress={() => navigation.navigate('DayViolations', { date: key })}/>
              );
            })}
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 350,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekDayText: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CalendarScreen;