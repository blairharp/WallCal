export interface HAEntityState {
  entity_id: string
  state: string
  attributes: Record<string, unknown>
  last_changed: string
  last_updated: string
}

export interface HAPerson {
  name: string
  state: string
  picture?: string
}

export interface HAWeather {
  temperature: number
  humidity?: number
  pressure?: number
  wind_speed?: number
  forecast?: HAForecast[]
}

export interface HAForecast {
  datetime: string
  condition: string
  temperature: number
  templow?: number
  precipitation?: number
}
