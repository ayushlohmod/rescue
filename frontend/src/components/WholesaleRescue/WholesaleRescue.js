import { ArrowRightIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import { PageTitle, FooterButton } from 'components'
import { formatLargeNumber, SE_API, STATUSES } from 'helpers'
import { useApi, useAuth } from 'hooks'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EditDonation } from './Wholesale.EditDonation'
import { AddRecipient } from './WholesaleRescue.AddRecipient'
import { EditRecipient } from './WholesaleRescue.EditRecipient'
import { Recipient } from './WholesaleRescue.Recipient'

const WholesaleRescueContext = createContext({})
WholesaleRescueContext.displayName = 'WholesaleRescueContext'
export const useWholesaleRescueContext = () =>
  useContext(WholesaleRescueContext)

export function WholesaleRescue({ setBreadcrumbs }) {
  const { id } = useParams()
  const { data: rescue, refresh } = useApi(`/rescues/${id}`)
  const { hasAdminPermission } = useAuth()
  const [editDonation, setEditDonation] = useState(false)
  const [addRecipient, setAddRecipient] = useState(false)
  const [editRecipient, setEditRecipient] = useState()
  const { user } = useAuth()

  const donation = useMemo(() => rescue?.stops[0], [rescue])
  const recipients = useMemo(() => rescue?.stops.slice(1), [rescue])
  const remainingWeight = useMemo(
    () =>
      donation && recipients
        ? donation.impact_data_total_weight -
          recipients.reduce(
            (total, curr) => total + curr.impact_data_total_weight,
            0
          )
        : null,
    [recipients, donation]
  )

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Wholesale', link: '/wholesale' },
      { label: 'Donation', link: `/wholesale/${id}` },
    ])
  }, [id])

  useEffect(() => {
    if (
      remainingWeight < rescue?.stops.length &&
      rescue?.status === STATUSES.ACTIVE
    ) {
      console.log('completing...')
      // complete rescue
      SE_API.post(
        `/wholesale/rescue/${rescue.id}/update`,
        { status: STATUSES.COMPLETED },
        user.accessToken
      ).then(refresh)
    }
  }, [remainingWeight, rescue])

  if (!rescue) return <LoadingDonation />

  return (
    <WholesaleRescueContext.Provider
      value={{ rescue, donation: rescue.stops[0], refresh, editRecipient }}
    >
      <PageTitle>
        {rescue.status === STATUSES.COMPLETED ? 'Completed ' : 'Active '}
        Donation
      </PageTitle>
      <Box pb="16">
        <Flex my="8" justify="space-between">
          <Box>
            <Heading
              as="h2"
              size="md"
              fontWeight="600"
              color="element.primary"
              mb="1"
            >
              {donation.organization.name}
            </Heading>
            <Text size="sm" fontWeight="300" color="element.secondary">
              {formatLargeNumber(donation.impact_data_total_weight)}{' '}
              lbs.&nbsp;&nbsp;|&nbsp;&nbsp;
              {donation.notes}
            </Text>
          </Box>
          {hasAdminPermission && (
            <IconButton
              variant="ghosted"
              color="se.brand.primary"
              icon={<EditIcon h="6" w="6" />}
              onClick={() => setEditDonation(true)}
            />
          )}
        </Flex>
        {recipients.length ? (
          recipients.map(i => (
            <Recipient
              key={i.id}
              recipient={i}
              setEditRecipient={setEditRecipient}
            />
          ))
        ) : (
          <Flex direction="column" my="12" justify="center" align="center">
            <ArrowRightIcon w="16" h="16" mb="8" color="se.brand.primary" />
            <Heading as="h4" align="center" mb="2">
              Let's distribute food!
            </Heading>
            <Text color="element.secondary" align="center">
              Add a recipient below to allocate food from this donation.
            </Text>
          </Flex>
        )}

        <EditDonation
          isOpen={editDonation}
          handleClose={() => setEditDonation(false)}
        />

        <EditRecipient
          isOpen={!!editRecipient}
          handleClose={() => setEditRecipient(null)}
        />

        <AddRecipient
          isOpen={addRecipient}
          handleClose={() => setAddRecipient(false)}
        />

        {hasAdminPermission && (
          <Flex justify="center" w="100%">
            <FooterButton
              onClick={() => setAddRecipient(true)}
              disabled={rescue.status === STATUSES.COMPLETED}
            >
              Add Recipient{' '}
              {rescue.status === STATUSES.ACTIVE
                ? `(${formatLargeNumber(remainingWeight)} lbs. remaining)`
                : ''}
            </FooterButton>
          </Flex>
        )}
      </Box>
    </WholesaleRescueContext.Provider>
  )
}

function LoadingDonation() {
  return (
    <>
      <PageTitle>Loading Donation...</PageTitle>
      <Skeleton w="100%" h="32" my="4" />
      <Skeleton w="100%" h="32" my="4" />
      <Skeleton w="100%" h="32" my="4" />
      <Skeleton w="100%" h="32" my="4" />
    </>
  )
}
