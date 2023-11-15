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
  ToggleGroup,
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

const Asana = ({ context, runServerless, addAlert, fetchCrmObjectProperties }: { context: any, runServerless: any, addAlert: any, fetchCrmObjectProperties: any }) => {

  const [dealStage, setDealStage] = useState()
  const [idAsana, setIdAsana] = useState()
  const [dealName, setDealName] = useState('')

  const [projectType, setProjectType] = useState<string | undefined>('Sales Ops Récurrent')
  const [name, setName] = useState('')
  const [admin, setAdmin] = useState<string | number | undefined>()
  const [associate, setAssociate] = useState<Array<string | number>>([])
  const [description, setDescription] = useState('')
  const [associatedContact, setAssociateContact] = useState<string | number | undefined>()

  const [users, setUsers] = useState([])
  const [optionsUsers, setOptionsUsers] = useState<{ label: string; value: string; }[]>([])

  const [error, setError] = useState('')

  const optionsProjectType = [
    { label: 'Sales Ops Récurrent', value: 'Sales Ops Récurrent' },
    { label: 'Sales Coach Récurrent', value: 'Sales Coach Récurrent' }
  ]

  useEffect(() => {
    fetchCrmObjectProperties(['dealstage', 'idasana', 'dealname']).then((properties: { [propertyName: string]: any }) => {
      setDealStage(properties.dealstage)
      setIdAsana(properties.idasana)
      setDealName(properties.dealname)
    })
    runServerless({
      name: 'getUsers',
      parameters: {
        dealStage: dealStage
      },
    }).then((resp: { status: string; response: { data: { data: any }; }; message: any; }) => {
      if (resp.status === 'SUCCESS') {
        setUsers(resp.response.data.data)
      } else {
        setError(resp.message || 'An error occurred')
      }
    })
  }, [fetchCrmObjectProperties])

  useEffect(() => {
    setName(dealName + ' - ' + projectType)
  }, [dealName, projectType])

  useEffect(() => {
    if (users) {
      const optionsTemp = users.map((user: { name: string; gid: string; }) => ({
        label: user.name,
        value: user.gid
      }))

      setOptionsUsers(optionsTemp)
    }
  }, [users])

  const handleSubmit = () => {
    runServerless({
      name: 'createProject',
      parameters: {
        name: name,
        admin: admin,
        associate: associate,
        description: description
      },
    }).then((resp: { status: string; response: { data: { data: any }; }; message: any; }) => {
      if (resp.status === 'SUCCESS') {
        console.log(resp)
      } else {
        setError(resp.message || 'An error occurred')
      }
    })
  }

  if (error) {
    return <Alert title="Error" variant="error">{error}</Alert>
  }

  return (
    <>
      {dealStage === "closedwon" && idAsana === null ?
        <Flex direction="column" gap="lg">
          <Flex justify="around">
            <Input
              name="deal_name"
              label="Nom de la transaction"
              value={dealName}
              onChange={(newDealName) => setDealName(newDealName)}
            />

            <ToggleGroup
              name="project_type"
              label="Type de projet"
              toggleType="radioButtonList"
              inline={true}
              options={optionsProjectType}
              value={projectType}
              onChange={(newProjectType) => setProjectType(newProjectType)}
            />
          </Flex>

          <Input
            name="name"
            label="Nom du projet"
            value={name}
            onChange={(newName) => setName(newName)}
          />

          <Flex justify="around">
            <Select
              name="admin"
              label="Admin du projet"
              options={optionsUsers}
              value={admin}
              onChange={(newAdmin) => setAdmin(newAdmin)}
            />

            <MultiSelect
              name="associes"
              label="Associés au projet"
              options={optionsUsers}
              value={associate}
              onChange={(newAssociate) => setAssociate(newAssociate)}
            />
          </Flex>

          <TextArea
            name="description"
            label="Description"
            value={description}
            onChange={(newDescription) => setDescription(newDescription)}
          />

          <Select
            name="contacts_associes"
            label="Contacts associés à la transaction"
            options={optionsUsers}
            value={associatedContact}
            onChange={(newAssociatedContact) => setAssociateContact(newAssociatedContact)}
          />

          <Button variant="primary" onClick={handleSubmit}>
            Créer le projet
          </Button>
        </Flex> : <Text>
          Le deal n'est pas encore gagné
        </Text>
      }
    </>
  )
}
