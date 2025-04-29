
type Cachelocation = 'localStorage' |'sessionStorage' | 'indexDB' | 'mysql'


interface CacheOptions  {
  encipher?: boolean,
  autoSave?: boolean,
  debounceTime?: number,
  cacheExpire?: number,
  cachelocation?: Cachelocation,
}


const useFormCache = (cacheKey:string, options: CacheOptions ={
  encipher: false,
  autoSave: false,
  debounceTime: 5000,
  cacheExpire: 1000 * 60 * 60 * 24 * 30,
  cachelocation: 'localStorage'
}) => {

}