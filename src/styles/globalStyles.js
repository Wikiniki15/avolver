import { StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../utils/constants';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray[800],
  },
  subtitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  text: {
    fontSize: SIZES.md,
    color: COLORS.gray[600],
  },
  textBold: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.gray[800],
  },
  textCenter: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitInfoContainer: {
  marginTop: SPACING.md,
},
unitInfoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: SPACING.sm,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.gray[100],
},
unitInfoIcon: {
  width: 40,
  height: 40,
  backgroundColor: COLORS.gray[100],
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: SPACING.sm,
},
unitInfoText: {
  flex: 1,
},
unitInfoLabel: {
  fontSize: SIZES.sm,
  color: COLORS.gray[600],
  marginBottom: SPACING.xs,
},
unitInfoValue: {
  fontSize: SIZES.md,
  fontWeight: '600',
  color: COLORS.gray[800],
},
editInfoButton: {
  marginTop: SPACING.md,
},
noUnitInfo: {
  alignItems: 'center',
  paddingVertical: SPACING.xxl,
},
noUnitInfoTitle: {
  fontSize: SIZES.lg,
  fontWeight: '600',
  color: COLORS.gray[700],
  marginTop: SPACING.md,
  marginBottom: SPACING.xs,
},
noUnitInfoText: {
  fontSize: SIZES.sm,
  color: COLORS.gray[600],
  textAlign: 'center',
  marginBottom: SPACING.lg,
  paddingHorizontal: SPACING.md,
},
registerUnitButton: {
  paddingHorizontal: SPACING.xl,
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: COLORS.white,
  borderRadius: 12,
  padding: SPACING.lg,
  width: '90%',
  maxWidth: 400,
},
modalTitle: {
  fontSize: SIZES.xl,
  fontWeight: 'bold',
  color: COLORS.gray[800],
  textAlign: 'center',
  marginBottom: SPACING.lg,
},
modalInput: {
  borderWidth: 1,
  borderColor: COLORS.gray[300],
  borderRadius: 8,
  padding: SPACING.sm,
  marginBottom: SPACING.md,
  fontSize: SIZES.md,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: SPACING.md,
},
modalButton: {
  flex: 0.48,
},
});