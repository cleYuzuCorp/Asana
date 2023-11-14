import React, { useEffect, useState } from "react"
import {
  Alert,
  Button,
  Flex,
  Input,
  MultiSelect,
  Select,
  Text,
  TextArea,
  hubspot,
} from "@hubspot/ui-extensions"

hubspot.extend<'crm.record.tab'>(({ context, runServerlessFunction, actions }) => (
  <Asana
    context={context}
    runServerless={runServerlessFunction}
    addAlert={actions.addAlert}
    fetchCrmObjectProperties={actions.fetchCrmObjectProperties}
  />
));

const Asana = ({ context, runServerless, addAlert, fetchCrmObjectProperties }: {context : any, runServerless: any, addAlert: any, fetchCrmObjectProperties: any}) => {

  const [dealStage, setDealStage] = useState()
  const [idAsana, setIdAsana] = useState()

  const [name, setName] = useState('')
  const [admin, setAdmin] = useState()
  const [associate, setAssociate] = useState([])
  const [description, setDescription] = useState('')
  const [associatedContact, setAssociateContact] = useState()

  const [error, setError] = useState()

  useEffect(() => {
    fetchCrmObjectProperties(['dealstage', 'idasana']).then((properties: { [propertyName: string]: any }) => {
      setDealStage(properties.dealstage)
      setIdAsana(properties.idasana)
    })

    runServerless({
      name: 'getUsers',
      parameters: {
        dealStage: dealStage
      },
    }).then((resp) => {
      if (resp.status === 'SUCCESS') {
        console.log(resp)
      } else {
        setError(resp.message || 'An error occurred')
      }
    })

  }, [fetchCrmObjectProperties])

  const options = [
    {label: 'Personne 1', value: 'p1'},
    {label: 'Personne 2', value: 'p2'}
  ]

  if (error !== '') {
    return <Alert title="Error" variant="error">{error}</Alert>
  }

  return (
    <>
      {dealStage === "closedwon" && idAsana === null ?
        <Flex direction="column" gap="lg">
          <Input
            name="name"
            label="Nom du projet"
            value={name}
            onChange={(newName) => setName(newName)}
          />

          <Select
            name="admin"
            label="Admin du projet"
            options={options}
            value={admin}
            onChange={(newAdmin) => setAdmin(newAdmin)}
          />

          <MultiSelect
            name="associes"
            label="Associés au projet"
            options={options}
            value={associate}
            onChange={(newAssociate) => setAssociate(newAssociate)}
          />

          <TextArea
            name="description"
            label="Description"
            value={description}
            onChange={(newDescription) => setDescription(newDescription)}
          />

          <Select
            name="contacts_associes"
            label="Contacts associés à la transaction"
            options={options}
            value={associatedContact}
            onChange={(newAssociatedContact) => setAssociateContact(newAssociatedContact)}
          />

          <Button>Créer le projet</Button>
        </Flex> : <Text>
          Le deal n'est pas encore gagné
        </Text>
      }
    </>
  )
}
