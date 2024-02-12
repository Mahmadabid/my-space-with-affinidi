export const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();

    const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    const dayDifference = currentDate.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        return (ageDifference - 1);
    }

    return ageDifference;
};