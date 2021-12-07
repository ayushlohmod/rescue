// all exports should be of type 'const' with an all caps var name separated by underscores

export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN
export const SENTRY_ENV = process.env.REACT_APP_SENTRY_ENV

export const IS_DEV_ENVIRONMENT = process.env.REACT_APP_FIREBASE_ENV === 'dev'

export const IS_PWA = window.matchMedia('(display-mode: standalone)').matches

// 600 pixels is our baseline threshold for handling a mobile screen vs. desktop
export const MOBILE_THRESHOLD = 600

export const PICKUP_STATUSES = {
  0: 'cancelled',
  1: 'scheduled',
  2: 'UNDEFINED_STATUS',
  3: 'in_progress',
  4: 'UNDEFINED_STATUS',
  5: 'UNDEFINED_STATUS',
  6: 'arrived',
  7: 'UNDEFINED_STATUS',
  8: 'UNDEFINED_STATUS',
  9: 'completed',
}

export const DELIVERY_STATUSES = {
  0: 'cancelled',
  1: 'scheduled',
  2: 'UNDEFINED_STATUS',
  3: 'in_progress',
  4: 'UNDEFINED_STATUS',
  5: 'UNDEFINED_STATUS',
  6: 'arrived',
  7: 'UNDEFINED_STATUS',
  8: 'UNDEFINED_STATUS',
  9: 'completed',
}

export const STOP_STATUSES = {
  0: 'cancelled',
  1: 'scheduled',
  2: 'UNDEFINED_STATUS',
  3: 'in_progress',
  4: 'UNDEFINED_STATUS',
  5: 'UNDEFINED_STATUS',
  6: 'arrived',
  7: 'UNDEFINED_STATUS',
  8: 'UNDEFINED_STATUS',
  9: 'completed',
}

export const ROUTE_STATUSES = {
  0: 'cancelled',
  1: 'scheduled',
  2: 'UNDEFINED_STATUS',
  3: 'active',
  4: 'UNDEFINED_STATUS',
  5: 'UNDEFINED_STATUS',
  6: 'UNDEFINED_STATUS',
  7: 'UNDEFINED_STATUS',
  8: 'UNDEFINED_STATUS',
  9: 'completed',
}

export const CLOUD_FUNCTION_URLS = {
  addCalendarEvent:
    process.env.REACT_APP_CLOUD_FUNCTION_BASE_URL + 'addCalendarEvent',
  deleteCalendarEvent:
    process.env.REACT_APP_CLOUD_FUNCTION_BASE_URL + 'deleteCalendarEvent',
}

/*

TODO: recurring routes? original_stop_id? is_philabundance_partner? route_id structure? do all routes fit into either retail, wholesale, or direct_link?

retail_rescue {

  id
  handler_id
  google_calendar_event_id
  is_direct_link
  status
  notes
  stop_ids

  timestamps {
    created
    updated
    started
    finished
    scheduled_start
    scheduled_finish
  }

  impact_data {
    dairy
    bakery
    produce
    meat_fish
    non_perishable
    prepared_frozen
    mixed
    other
    total_weight
  }

}


wholesale_rescue {

  id
  handler_id
  is_direct_link
  notes
  pickup_id
  delivery_id

  timestamps {
    created
    updated
  }

  impact_data {
    dairy
    bakery
    produce
    meat_fish
    non_perishable
    prepared_frozen
    mixed
    other
    total_weight
  }

}





pickup {

  id
  handler_id
  rescue_id
  rescue_type (wholesale/retail)
  organization_id
  location_id
  status
  notes
  delivery_ids

  timestamps {
    created
    updated
    started
    arrived
    finished
  }

  impact_data {
    dairy
    bakery
    produce
    meat_fish
    non_perishable
    prepared_frozen
    mixed
    other
    total_weight
  }

}



delivery {

  id
  handler_id
  rescue_id
  rescue_type (wholesale/retail)
  organization_id
  location_id

  timestamps {
    created
    updated
    started
    arrived
    finished
  }

  impact_data {
    dairy
    bakery
    produce
    meat_fish
    non_perishable
    prepared_frozen
    mixed
    other
    total_weight
    percent_of_total_dropped
  }

}

organization {
  id
  name
  primary_location_id
  type (food_bank, community_fridge, home_delivery, retail, wholesale, holding)

  timestamps {
    created
    updated
  }

}

location {
  id
  nickname
  organization_id

  address1
  address2
  city
  state
  zip
  lat
  lng

  contact_name
  contact_email
  contact_phone
  instructions
  notes

  timestamps {
    created
    updated
  }


  hours {
    sun_open
    sun_close
    mon_open
    mon_close
    tue_open
    tue_close
    wed_open
    wed_close
    thu_open
    thu_close
    fri_open
    fri_close
    sat_open
    sat_close
  }

}

user {
  id
  is_driver
  is_admin
  name
  icon
  email
  phone
  pronouns
  granted_access_by

  timestamps {
    created
    updated
    granted_access
    last_login
  }

  insurance_policy_number
  insurance_provider
  license_number
  license_state

  availability {
    sun_am
    sun_pm
    mon_am
    mon_pm
    tue_am
    tue_pm
    wed_am
    wed_pm
    thu_am
    thu_pm
    fri_am
    fri_pm
    sat_am
    sat_pm
  }

}

*/
