import React, { useEffect, useState } from "react"
import {
  Accordion,
  Alert,
  Button,
  Flex,
  Heading,
  Input,
  MultiSelect,
  Select,
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
))

const Asana = ({ context, runServerless, addAlert, fetchCrmObjectProperties }: { context: any, runServerless: any, addAlert: any, fetchCrmObjectProperties: any }) => {

  const [dealId, setDealId] = useState()
  const [dealStage, setDealStage] = useState()
  const [idAsana, setIdAsana] = useState()
  const [dealName, setDealName] = useState('')

  const [open, setOpen] = useState(false)

  const [projectType, setProjectType] = useState<string | undefined>('')
  const [name, setName] = useState('')
  const [admin, setAdmin] = useState<string | number | undefined>()
  const [associate, setAssociate] = useState<Array<string | number>>([])

  const [origin, setOrigin] = useState('')
  const [issue, setIssue] = useState('')
  const [need, setNeed] = useState('')
  const [instruction, setInstruction] = useState('')
  const [decisionMakers, setDecisionMakers] = useState('')
  const [propaleLink, setPropaleLink] = useState('')
  const [subcontracting, setSubcontracting] = useState('')
  const [daySoldCount, setDaySoldCount] = useState('')
  const [endDateProject, setEndDateProject] = useState('')
  const [otherProject, setOtherProject] = useState('')

  const [workspaces, setWorkspaces] = useState([{ gid: '', name: '', resource_type: '' }])
  const [teams, setTeams] = useState([])
  const [team, setTeam] = useState<string | number | undefined>()
  const [optionsTeams, setOptionsTeams] = useState<{ label: string; value: string; }[]>([])
  const [users, setUsers] = useState([])
  const [optionsUsers, setOptionsUsers] = useState<{ label: string; value: string; }[]>([])

  const [project, setProject] = useState({ gid: '', name: '', resource_type: '' })
  const [time, setTime] = useState('')

  const [error, setError] = useState('')

  const optionsProjectType = [
    { label: 'Sales Ops Récurrent', value: 'Sales Ops Récurrent' },
    { label: 'Sales Coach Récurrent', value: 'Sales Coach Récurrent' }
  ]

  useEffect(() => {
    fetchCrmObjectProperties(['hs_object_id', 'dealstage', 'idasana', 'dealname', 'commentaire___enjeu', 'commentaire___besoin', 'commentaire___decideurs']).then((properties: { [propertyName: string]: any }) => {
      setDealId(properties.hs_object_id)
      setDealStage(properties.dealstage)
      setIdAsana(properties.idasana)
      setDealName(properties.dealname)
      setIssue(properties.commentaire___enjeu)
      setNeed(properties.commentaire___besoin)
      setDecisionMakers(properties.commentaire___decideurs)
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

    runServerless({
      name: 'getWorkspaces',
      parameters: {
        dealStage: dealStage
      },
    }).then((resp: { status: string; response: { data: { data: any }; }; message: any; }) => {
      if (resp.status === 'SUCCESS') {
        setWorkspaces(resp.response.data.data)
      } else {
        setError(resp.message || 'An error occurred')
      }
    })
  }, [fetchCrmObjectProperties])

  useEffect(() => {
    if (idAsana) {
      runServerless({
        name: 'getProjectTime',
        parameters: {
          idAsana: idAsana,
        },
      }).then((resp: { status: string; response: { data: any; }; message: any; }) => {
        if (resp.status === 'SUCCESS') {
          const timesArray = resp.response.data.map((item: any) => item.time)
          const totalSeconds = timesArray.reduce((total: any, seconds: any) => total + seconds, 0)

          const hours = Math.floor(totalSeconds / 3600)
          const minutes = Math.floor((totalSeconds % 3600) / 60)
          const remainingSeconds = totalSeconds % 60

          const formattedTime = `${hours}h ${minutes}m ${remainingSeconds}s`
          setTime(formattedTime)
        } else {
          setError(resp.message || 'An error occurred')
        }
      })
    }
  }, [idAsana])

  useEffect(() => {
    if (workspaces[0].gid !== '') {
      runServerless({
        name: 'getTeams',
        parameters: {
          workspace: workspaces[0].gid
        },
      }).then((resp: { status: string; response: { data: { data: any }; }; message: any; }) => {
        if (resp.status === 'SUCCESS') {
          setTeams(resp.response.data.data)
        } else {
          setError(resp.message || 'An error occurred')
        }
      })
    }
  }, [workspaces])

  useEffect(() => {
    projectType === '' ? setName(dealName) : setName(dealName + ' - ' + projectType)
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

  useEffect(() => {
    if (teams) {
      const optionsTemp = teams.map((team: { name: string; gid: string; }) => ({
        label: team.name,
        value: team.gid
      }))

      setOptionsTeams(optionsTemp)
    }
  }, [teams])

  useEffect(() => {
    if (project.gid !== '') {
      runServerless({
        name: 'createTask',
        parameters: {
          project: project.gid,
          origin: origin,
          issue: issue,
          need: need,
          instruction: instruction,
          decisionMakers: decisionMakers,
          propaleLink: propaleLink,
          subcontracting: subcontracting,
          daySoldCount: daySoldCount,
          endDateProject: endDateProject,
          otherProject: otherProject
        },
      }).then((resp: { status: string; response: { data: { data: any }; }; message: any; }) => {
        if (resp.status === 'SUCCESS') {
          console.log(resp)
        } else {
          setError(resp.message || 'An error occurred')
        }
      })

      runServerless({
        name: 'updateIdAsana',
        parameters: {
          dealId: dealId,
          value: project.gid
        },
      }).then((resp: { status: string; response: { data: { data: any }; }; message: any; }) => {
        if (resp.status === 'SUCCESS') {
          setIdAsana(resp.response.data.data.gid)
        } else {
          setError(resp.message || 'An error occurred')
        }
      })
    }
  }, [project])

  const handleSubmit = () => {
    runServerless({
      name: 'createProject',
      parameters: {
        name: name,
        admin: admin,
        associate: associate,
        team: team
      }
    }).then((resp: { status: string; response: { data: { data: any }; }; message: any; }) => {
      if (resp.status === 'SUCCESS') {
        addAlert({
          type: 'success',
          message: 'Projet créer avec succès !',
        })

        setProject(resp.response.data.data)
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
      {dealStage === "6502009" && !idAsana ?
        <Flex direction="column" gap="lg">
          <Accordion title="Création du projet Asana" open={open ? false : true} onClick={() => setOpen(open ? false : true)}>
            <Flex direction="column" gap="md">
              <Input
                name="name"
                label="Nom du projet"
                required={true}
                value={name}
                onChange={(newName: any) => setName(newName)}
              />

              <Flex justify="around">
                <Input
                  name="deal_name"
                  label="Nom de la transaction"
                  value={dealName}
                  onChange={(newDealName: any) => setDealName(newDealName)}
                />

                <ToggleGroup
                  name="project_type"
                  label="Type de projet"
                  toggleType="radioButtonList"
                  inline={true}
                  options={optionsProjectType}
                  value={projectType}
                  onChange={(newProjectType: any) => setProjectType(newProjectType)}
                />
              </Flex>

              <Flex justify="around">
                <Select
                  name="admin"
                  label="Chef de projet"
                  required={true}
                  options={optionsUsers}
                  value={admin}
                  onChange={(newAdmin: any) => setAdmin(newAdmin)}
                />

                <MultiSelect
                  name="associes"
                  label="Associés au projet"
                  required={true}
                  options={optionsUsers}
                  value={associate}
                  onChange={(newAssociate: any) => setAssociate(newAssociate)}
                />
              </Flex>

              <Select
                name="teams"
                label="Équipe"
                required={true}
                options={optionsTeams}
                value={team}
                onChange={(newTeam: any) => setTeam(newTeam)}
              />

              <Button variant="primary" disabled={name && admin && associate && team ? false : true} onClick={() => setOpen(true)}>
                Renseigner les informations du projet
              </Button>
            </Flex>
          </Accordion>

          <Accordion title="Informations du projet" open={open ? true : false} onClick={() => setOpen(open ? false : true)}>
            <Flex direction="column" gap="md">
              <TextArea
                name="origin"
                label="Origines et informations non formelles"
                value={origin}
                onChange={(newOrigin) => setOrigin(newOrigin)}
                tooltip="Décrire ici d'où vient la demande cliente, comment elle à été obtenu et toutes les infos ou ressentis obtenus. L'objectif est d'aider le chef de projet à avoir un contexte avant que ce projet arrive."
              />

              <TextArea
                name="issue"
                label="Enjeux"
                value={issue}
                onChange={(newIssue) => setIssue(newIssue)}
                tooltip="Décrire ici à quoi le projet répond en terme de besoin/douleur/amélioration pour le client. Il s'agit de bien décrire aussi les attentes du client en terme de macro."
              />

              <TextArea
                name="need"
                label="Besoin"
                value={need}
                onChange={(newNeed) => setNeed(newNeed)}
                tooltip="Décrire les grandes phrases dans votre proposition commerciale (ateliers, phase, étape). Il s'agit ici de décrire comment vous imaginez le déroulé de sa prestation. Il est important de donner des informations qui ne sont pas dans la proposition en pointant des informations importantes transmises uniquement au client"
              />

              <TextArea
                name="instruction"
                label="Consigne"
                value={instruction}
                onChange={(newInstruction) => setInstruction(newInstruction)}
                tooltip="Décrire ici toute information concernant la flexibilité sur le planning, le délai, les livrables, les ateliers, les points de vigilance projet."
              />

              <TextArea
                name="desicion_maker"
                label="Décideurs"
                value={decisionMakers}
                onChange={(newDecisionMakers) => setDecisionMakers(newDecisionMakers)}
                tooltip="Décrire ici le rôle de chaque interlocuteur et personne que vous avez identifier à date dans le cadre du projet. Préciser leur lien hiérarchique et leur influence sur le projet. Il peut y avoir des partenaires aussi présent."
              />

              <TextArea
                name="propale_link"
                label="Lien propale"
                value={propaleLink}
                onChange={(newPropaleLink) => setPropaleLink(newPropaleLink)}
              />

              <TextArea
                name="subcontracting"
                label="Sous traitance"
                value={subcontracting}
                onChange={(newSubcontracting) => setSubcontracting(newSubcontracting)}
                tooltip="Indiquer si sous traitance"
              />

              <TextArea
                name="day_sold_count"
                label="Nombre de jours vendus"
                value={daySoldCount}
                onChange={(newDaySoldCount) => setDaySoldCount(newDaySoldCount)}
              />

              <TextArea
                name="end_date"
                label="Date de fin du projet souhaité"
                value={endDateProject}
                onChange={(newEndDateProject) => setEndDateProject(newEndDateProject)}
              />

              <TextArea
                name="other_project"
                label="Autres projets lié/dépendant au projet"
                value={otherProject}
                onChange={(newOtherProject) => setOtherProject(newOtherProject)}
              />

              <Button variant="primary" disabled={name && admin && associate && team ? false : true} onClick={handleSubmit}>
                Créer le projet
              </Button>
            </Flex>
          </Accordion>
        </Flex> : dealStage === "6502009" && idAsana ? <Flex>
          <Heading>Temps passé sur le projet : {time}</Heading>
        </Flex> : <Heading>
          Le deal n'est pas encore gagné
        </Heading>
      }
    </>
  )
}
