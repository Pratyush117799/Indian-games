/**
 * tagGenerator.js
 * Generates unique player ID tags like #Arjun-4291
 */

const CULTURAL_NAMES = [
  'Arjun','Kaveri','Dharma','Priya','Vikram','Meera','Kiran','Tara',
  'Rajan','Ananya','Surya','Lalita','Mohan','Savitri','Devraj','Kamala',
  'Harish','Parvati','Gopal','Radha','Siddha','Usha','Ashok','Vimala',
  'Pratap','Shanti','Nakul','Ganga','Bharat','Yamuna','Chandra','Indra',
  'Varun','Agni','Veda','Maya','Soma','Shakti','Shiva','Uma',
  'Rohit','Jyoti','Kedar','Tulsi','Samir','Nandita','Rishi','Durga',
]

export const generateTagId = () => {
  const name = CULTURAL_NAMES[Math.floor(Math.random() * CULTURAL_NAMES.length)]
  const num  = String(Math.floor(Math.random() * 9000) + 1000)
  return `${name}-${num}`
}

export const formatTag = (tagId) => `#${tagId}`
