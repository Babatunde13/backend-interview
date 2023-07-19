const validEmail = (email: string) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)
const validPassword = (password: string) => /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,30}$/.test(password)
const validPhone = (phone: string) => /^(?:\+234|234|0)(?:\d{10})$/.test(phone)
const validName = (name: string) => /^[a-zA-Z]{2,}(?: [a-zA-Z]+){2,}$/.test(name)

export const signupValidator = (payload) => {
  if (!validEmail(payload.email)) {
    return {
      error: true,
      message: 'Email is invalid',
    }
  }

  if (!validPassword(payload.password)) {
    return {
      error: true,
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
    }
  }

  if (!validName(payload.name)) {
    return {
      error: true,
      message: 'Name should contain only letters with fname and lname separated by a space',
    }
  }

  // phone number should be 10 digits long prefixed with +234 or 0
  if (!validPhone(payload.phone)) {
    return {
      error: true,
      message: 'Phone number should be 10 digits long prefixed with +234 or 0',
    }
  }

  if (payload.phone.startsWith('0')) {
    payload.phone = payload.phone.replace('0', '+234')
  } else if (payload.phone.startsWith('234')) {
    payload.phone = payload.phone.replace('234', '+234')
  }

  return {
    data: payload,
    error: false,
  }
}

export const loginValidator = (payload) => {
  if (!validEmail(payload.email)) {
    return {
      error: true,
      message: 'Email is invalid',
    }
  }

  if (!validPassword(payload.password)) {
    return {
      error: true,
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
    }
  }

  return {
    data: payload,
    error: false,
  }
}
