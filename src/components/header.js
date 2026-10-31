import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function Header({ monthName, year, onPrev, onNext, onToday }) {
    const { colors } = useTheme();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
                <Text style={[styles.navBtnText, { color: colors.today }]}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onToday}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {monthName} {year}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNext} style={styles.navBtn}>
                <Text style={[styles.navBtnText, { color: colors.today }]}>{'>'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    navBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    navBtnText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default Header;