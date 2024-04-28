import { IUser } from "../../../shared/models/User";

export function percentageCalc(score: number) {
    if (score >= 1.00 && score <= 1.99) {
        return 0;
    } else if (score > 1.99 && score <= 2.99) {
        return 0;
    } else if (score >= 3.00 && score < 3.10) {
        return 0;
    } else if (score >= 3.10 && score <= 3.49) {
        return 10;
    } else if (score >= 3.50 && score <= 3.99) {
        return 12;
    } else if (score >= 4.00 && score <= 4.59) {
        return 14;
    } else if (score >= 4.60 && score <= 5.00) {
        return 16;
    } else {
        return "-"
    }
}

export function getScorecardPeriod(user: IUser, sid: string) {
    const startMonth = user.scorecardPeriod?.find((s) => s.scorecardId === sid)?.startDate;
    const endMonth = user.scorecardPeriod?.find((s) => s.scorecardId === sid)?.endDate;

    // Check if startMonth and endMonth are defined
    if (!startMonth || !endMonth) {
        return 0; // Or handle the case where start or end month is not defined
    }

    const startDate = new Date(startMonth);
    const endDate = new Date(endMonth);


    // Check if startDate and endDate are valid dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 0; // Or handle the case where start or end date is not a valid date
    }

    // Calculate the difference in months
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Approximate months

    return diffMonths;
}

export function getPeriodStart(user: IUser, sid: string) {
    const month = user.scorecardPeriod?.find((s) => s.scorecardId === sid)?.startDate;
    if (month) {
        return month;
    }
    else {
        return "Period Not Set"
    }
}
export function getPeriod(user: IUser, sid: string) {
    const month = user.scorecardPeriod?.find((s) => s.scorecardId === sid)?.endDate;
    if (month) {
        return month;
    }
    else {
        return "Period Not Set"
    }
}


export function flagOutElligableUser() {

}

