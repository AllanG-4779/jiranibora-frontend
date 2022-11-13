export const passwordStrong = (password: string) => {
  const exp = /[a-z]+[A-Z]+[1-9]+[~`!@#$%^&*()-,.|+=<>?/}{}\]\[]+/;
  return exp.test(password);
};
export const emailValid = (email: string) => {
  const exp = /[a-zA-Z]+[A-Za-z0-9]+@[a-zA-Z]+\.[A-Za-z]+/;
  return exp.test(email)
};
export const phoneValid = (phone:string)=>{
  const exp = /[71]{1}[0-9]{8}/;
  return exp.test(phone)
}