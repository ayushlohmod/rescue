import React, { useEffect, useState } from 'react'
import { useAuth } from 'contexts'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'
import { Input, Loading } from 'components'
import { useUserData } from 'hooks'
import validator from 'validator'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export function Profile({ handleUpdateClick, inForm }) {
  const { user } = useAuth()
  const profile = useUserData(user ? user.uid : null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pronouns: '',
  })
  const [button, setButton] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    // update formData only once by checking name population
    if (!button && !formData.name && profile && profile.name) {
      setFormData({
        name: profile.name,
        phone: profile.phone || '',
        pronouns: profile.pronouns || '',
      })
    }
  }, [profile, formData, button])

  function validateInformation() {
    if (
      !formData.name ||
      !validator.isAlphanumeric(formData.name.split(' ')[0])
    ) {
      setError("Please enter your Profile's Name")
      return false
    } else if (!formData.phone || !isPossiblePhoneNumber(formData.phone)) {
      setError(
        'Your phone may contain invalid characters or missing some digits'
      )
      return false
    }
    return true
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    setButton('update profile')
  }

  function handlePhoneInputChange(changeValue) {
    setFormData(prevData => {
      return { ...prevData, phone: changeValue }
    })
    setButton('update profile')
  }

  function handleUpdate() {
    if (validateInformation()) {
      firebase
        .firestore()
        .collection('Users')
        .doc(user.uid)
        .set(formData, { merge: true })
        .then(() => {
          setButton('profile updated!')
          setTimeout(() => setButton(), 2000)
          setError()
          handleUpdateClick()
        })
        .catch(e => console.error('Error updating profile: ', e))
    } else {
      setTimeout(() => setError(), 4000)
    }
  }

  const WarningText = ({ text }) => {
    return (
      <div className="warning-text">
        <p>{text}</p>
      </div>
    )
  }

  return !profile ? (
    <Loading text="Loading profile" />
  ) : (
    <main id="Profile">
      {inForm && (
        <WarningText text="Please update your phone number and preferred pronouns" />
      )}
      <img src={profile.icon} alt={profile.name} />
      <h3>{profile.email}</h3>
      <button>
        {' '}
        <Link to="/liability">View Onboarding Documents</Link>
      </button>
      <Input
        element_id="name"
        label="Display Name"
        value={formData.name}
        onChange={handleChange}
      />
      <Input
        element_id="pronouns"
        label="Personal Pronouns"
        value={formData.pronouns}
        onChange={handleChange}
      />
      <PhoneInput
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handlePhoneInputChange}
        defaultCountry="US"
      />
      {button && (
        <button onClick={handleUpdate} disabled={button !== 'update profile'}>
          {button}
        </button>
      )}
      {error && <p id="FormError">{error}</p>}
    </main>
  )
}
