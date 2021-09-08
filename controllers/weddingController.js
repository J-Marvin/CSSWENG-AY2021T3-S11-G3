const db = require('../models/db.js')
const personFields = require('../models/person')
const coupleFields = require('../models/couple')
const weddingRegFields = require('../models/weddingRegistry')
const witnessFields = require('../models/witness')
const memberFields = require('../models/members')
const { Condition, queryTypes } = require('../models/condition')
const { sendError } = require('../controllers/errorController')
const { tables } = require('../models/db.js')

const weddingController = {
  /**
   * This function renders the add wedding page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddWeddingPage: function (req, res) {
    if (req.session.level === null || req.session.level === undefined) {
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        backLink: '/forms_main_page',
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    } else {
      const joinTables = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      db.find(db.tables.MEMBER_TABLE, [], joinTables, '*', function (result) {
        if (result) {
          const data = {}
          data.members = result
          data.styles = ['forms']
          data.scripts = ['addWedding']
          data.backLink = parseInt(req.session.level) >= 2 ? '/wedding_main_page' : '/forms_main_page'
          data.males = data.members.filter((element) => { return element[memberFields.SEX] === 'Male' })
          data.females = data.members.filter((element) => { return element[memberFields.SEX] === 'Female' })
          data.singleMales = data.males.filter((element) => { return element[memberFields.WEDDING_REG] === null })
          data.singleFemales = data.females.filter((element) => { return element[memberFields.WEDDING_REG] === null })
          res.render('add-wedding-registry', data)
        }
      })
    }
  },
  /**
   * This function renders the view of a specific wedding record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewWeddingPage: function (req, res) {
    // function execution starts here
    const weddingId = parseInt(req.params.wedding_id)
    if (parseInt(req.session.level) >= 2 || parseInt(req.session.editId) === weddingId) {
      /*
        FROM wedding_reg
        JOIN couples ON couples.couple_id = wedding_reg.couple_id
        JOIN people ON people.person_id = couples.
      */
      const joinTables = [
        // joins wedding_reg.couple_id = couples.couple_id
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.COUPLE,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },
        // joins bride's person record
        {
          tableName: { bride: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: 'bride.' + personFields.ID
        },
        // joins groom's person record
        {
          tableName: { groom: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: 'groom.' + personFields.ID
        },
        // left join that catches if bride has a member record
        {
          type: 'leftJoin',
          tableName: { bride_member: db.tables.MEMBER_TABLE },
          sourceCol: 'bride.' + personFields.MEMBER,
          destCol: 'bride_member.' + memberFields.ID
        },
        // left join that catches if groom has a member record
        {
          type: 'leftJoin',
          tableName: { groom_member: db.tables.MEMBER_TABLE },
          sourceCol: 'groom.' + personFields.MEMBER,
          destCol: 'groom_member.' + memberFields.ID
        },
        // join bride parents
        {
          type: 'leftJoin',
          tableName: { bride_parents: db.tables.COUPLE_TABLE },
          sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.BRIDE_PARENTS,
          destCol: 'bride_parents.' + coupleFields.ID
        },
        // join groom parents
        {
          type: 'leftJoin',
          tableName: { groom_parents: db.tables.COUPLE_TABLE },
          sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.GROOM_PARENTS,
          destCol: 'groom_parents.' + coupleFields.ID
        },
        // bride_parents (mother)
        {
          type: 'leftJoin',
          tableName: { bride_mother: db.tables.PERSON_TABLE },
          sourceCol: 'bride_parents.' + coupleFields.FEMALE,
          destCol: 'bride_mother.' + personFields.ID
        },
        // bride_parents (father)
        {
          type: 'leftJoin',
          tableName: { bride_father: db.tables.PERSON_TABLE },
          sourceCol: 'bride_parents.' + coupleFields.MALE,
          destCol: 'bride_father.' + personFields.ID
        },
        // left join that catches if the bride's mother is a member
        {
          type: 'leftJoin',
          tableName: { bride_mother_member: db.tables.MEMBER_TABLE },
          sourceCol: 'bride_mother.' + personFields.MEMBER,
          destCol: 'bride_mother_member.' + memberFields.ID
        },
        // left join that catches if the bride's father is a member
        {
          type: 'leftJoin',
          tableName: { bride_father_member: db.tables.MEMBER_TABLE },
          sourceCol: 'bride_father.' + personFields.MEMBER,
          destCol: 'bride_father_member.' + memberFields.ID
        },
        // groom_parents (mother)
        {
          type: 'leftJoin',
          tableName: { groom_mother: db.tables.PERSON_TABLE },
          sourceCol: 'groom_parents.' + coupleFields.FEMALE,
          destCol: 'groom_mother.' + personFields.ID
        },
        // groom_parents (father)
        {
          type: 'leftJoin',
          tableName: { groom_father: db.tables.PERSON_TABLE },
          sourceCol: 'groom_parents.' + coupleFields.MALE,
          destCol: 'groom_father.' + personFields.ID
        },
        // left join that catches if the groom's mother is a member
        {
          type: 'leftJoin',
          tableName: { groom_mother_member: db.tables.MEMBER_TABLE },
          sourceCol: 'groom_mother.' + personFields.MEMBER,
          destCol: 'groom_mother_member.' + memberFields.ID
        },
        // left join that catches if the bride's father is a member
        {
          type: 'leftJoin',
          tableName: { groom_father_member: db.tables.MEMBER_TABLE },
          sourceCol: 'groom_father.' + personFields.MEMBER,
          destCol: 'groom_father_member.' + memberFields.ID
        }
      ]
      // columns to be retrieved
      const columns = [
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.ID + ' as wedding_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.COUPLE + ' as couple_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE + ' as date',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE_OF_WEDDING + ' as wedding_date',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.BRIDE_PARENTS + ' as bride_parents_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.GROOM_PARENTS + ' as groom_parents_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.LOCATION + ' as location',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.SOLEMNIZER + ' as solemnizer',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.WEDDING_OFFICIANT + ' as officiant',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.CONTRACT + ' as contract_no',
        // bride's name
        'bride.' + personFields.FIRST_NAME + ' as bride_first_name',
        'bride.' + personFields.MID_NAME + ' as bride_mid_name',
        'bride.' + personFields.LAST_NAME + ' as bride_last_name',
        'bride.' + personFields.MEMBER + ' as bride_member_id',
        // groom's name
        'groom.' + personFields.FIRST_NAME + ' as groom_first_name',
        'groom.' + personFields.MID_NAME + ' as groom_mid_name',
        'groom.' + personFields.LAST_NAME + ' as groom_last_name',
        'groom.' + personFields.MEMBER + ' as groom_member_id',
        // name of the bride's mother
        'bride_mother.' + personFields.FIRST_NAME + ' as bride_mother_first_name',
        'bride_mother.' + personFields.MID_NAME + ' as bride_mother_mid_name',
        'bride_mother.' + personFields.LAST_NAME + ' as bride_mother_last_name',
        'bride_mother.' + personFields.MEMBER + ' as bride_mother_member_id',
        // name of the bride's father
        'bride_father.' + personFields.FIRST_NAME + ' as bride_father_first_name',
        'bride_father.' + personFields.MID_NAME + ' as bride_father_mid_name',
        'bride_father.' + personFields.LAST_NAME + ' as bride_father_last_name',
        'bride_father.' + personFields.MEMBER + ' as bride_father_member_id',
        // name of the groom's mother
        'groom_mother.' + personFields.FIRST_NAME + ' as groom_mother_first_name',
        'groom_mother.' + personFields.MID_NAME + ' as groom_mother_mid_name',
        'groom_mother.' + personFields.LAST_NAME + ' as groom_mother_last_name',
        'groom_mother.' + personFields.MEMBER + ' as groom_mother_member_id',
        // name of the groom's father
        'groom_father.' + personFields.FIRST_NAME + ' as groom_father_first_name',
        'groom_father.' + personFields.MID_NAME + ' as groom_father_mid_name',
        'groom_father.' + personFields.LAST_NAME + ' as groom_father_last_name',
        'groom_father.' + personFields.MEMBER + ' as groom_father_member_id'
      ]
      // set the WHERE condition: wedding_id = <weddingId>
      const cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.WEDDING_TABLE + '.' + weddingRegFields.ID, weddingId)

      const witnessJoin = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      const witnessColumns = [
        db.tables.WITNESS_TABLE + '.' + witnessFields.DEDICATION + ' as dedication_id',
        db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON + ' as witness_person_id',
        db.tables.WITNESS_TABLE + '.' + witnessFields.ID + ' as witness_id',
        db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as witness_member_id',
        db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as witness_first_name',
        db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as witness_mid_name',
        db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as witness_last_name',
        db.tables.WITNESS_TABLE + '.' + witnessFields.TYPE + ' as type'
      ]

      // set the WHERE condition: wedding_id = <weddingId>
      const witnessCond = new Condition(queryTypes.where)
      witnessCond.setKeyValue(db.tables.WITNESS_TABLE + '.' + witnessFields.WEDDING, weddingId)
      console.log(cond)

      // find them
      db.find(db.tables.WEDDING_TABLE, cond, joinTables, columns, function (result) {
        // store to data\
        console.log(result)
        if (result !== null && result.length > 0) {
          console.log(result)
          const data = {
            ...result[0]
          }
          data.canSee = (parseInt(req.session.weddingId) === parseInt(weddingId)) || (parseInt(req.session.level) >= 2)
          if ((parseInt(req.session.level) <= 2)) {
            data.canSee = false
          }
          data.styles = ['view']
          // data.scripts = ['']
          data.backLink = parseInt(req.session.level) >= 2 ? '/wedding_main_page' : '/forms_main_page'
          db.find(db.tables.WITNESS_TABLE, witnessCond, witnessJoin, witnessColumns, function (result) {
            if (result) {
              data.witnesses = result
              // Filters all Godfathers
              data.witnessMale = data.witnesses.filter((witness) => { return witness.type === 'Godfather' })
              // Filters all Godmothers
              data.witnessFemale = data.witnesses.filter((witness) => { return witness.type === 'Godmother' })
              console.log(data)
              res.render('view-wedding', data)
            }
          })
        } else {
          sendError(req, res, 404, '404 Wedding Record Not Found')
        }
      })
    } else {
      sendError(req, res, 401)
    }
  },

  getEditWedding: function (req, res) {
    const weddingId = parseInt(req.params.wedding_id)
    req.session.level = 3
    if (parseInt(req.session.level) >= 2 || parseInt(req.session.editId) === weddingId) {
      /*
        FROM wedding_reg
        JOIN couples ON couples.couple_id = wedding_reg.couple_id
        JOIN people ON people.person_id = couples.
      */
      const joinTables = [
        // joins wedding_reg.couple_id = couples.couple_id
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.COUPLE,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },
        // joins bride's person record
        {
          tableName: { bride: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: 'bride.' + personFields.ID
        },
        // joins groom's person record
        {
          tableName: { groom: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: 'groom.' + personFields.ID
        },
        // left join that catches if bride has a member record
        {
          type: 'leftJoin',
          tableName: { bride_member: db.tables.MEMBER_TABLE },
          sourceCol: 'bride.' + personFields.MEMBER,
          destCol: 'bride_member.' + memberFields.ID
        },
        // left join that catches if groom has a member record
        {
          type: 'leftJoin',
          tableName: { groom_member: db.tables.MEMBER_TABLE },
          sourceCol: 'groom.' + personFields.MEMBER,
          destCol: 'groom_member.' + memberFields.ID
        },
        // join bride parents
        {
          type: 'leftJoin',
          tableName: { bride_parents: db.tables.COUPLE_TABLE },
          sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.BRIDE_PARENTS,
          destCol: 'bride_parents.' + coupleFields.ID
        },
        // join groom parents
        {
          type: 'leftJoin',
          tableName: { groom_parents: db.tables.COUPLE_TABLE },
          sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.GROOM_PARENTS,
          destCol: 'groom_parents.' + coupleFields.ID
        },
        // bride_parents (mother)
        {
          type: 'leftJoin',
          tableName: { bride_mother: db.tables.PERSON_TABLE },
          sourceCol: 'bride_parents.' + coupleFields.FEMALE,
          destCol: 'bride_mother.' + personFields.ID
        },
        // bride_parents (father)
        {
          type: 'leftJoin',
          tableName: { bride_father: db.tables.PERSON_TABLE },
          sourceCol: 'bride_parents.' + coupleFields.MALE,
          destCol: 'bride_father.' + personFields.ID
        },
        // left join that catches if the bride's mother is a member
        {
          type: 'leftJoin',
          tableName: { bride_mother_member: db.tables.MEMBER_TABLE },
          sourceCol: 'bride_mother.' + personFields.MEMBER,
          destCol: 'bride_mother_member.' + memberFields.ID
        },
        // left join that catches if the bride's father is a member
        {
          type: 'leftJoin',
          tableName: { bride_father_member: db.tables.MEMBER_TABLE },
          sourceCol: 'bride_father.' + personFields.MEMBER,
          destCol: 'bride_father_member.' + memberFields.ID
        },
        // groom_parents (mother)
        {
          type: 'leftJoin',
          tableName: { groom_mother: db.tables.PERSON_TABLE },
          sourceCol: 'groom_parents.' + coupleFields.FEMALE,
          destCol: 'groom_mother.' + personFields.ID
        },
        // groom_parents (father)
        {
          type: 'leftJoin',
          tableName: { groom_father: db.tables.PERSON_TABLE },
          sourceCol: 'groom_parents.' + coupleFields.MALE,
          destCol: 'groom_father.' + personFields.ID
        },
        // left join that catches if the groom's mother is a member
        {
          type: 'leftJoin',
          tableName: { groom_mother_member: db.tables.MEMBER_TABLE },
          sourceCol: 'groom_mother.' + personFields.MEMBER,
          destCol: 'groom_mother_member.' + memberFields.ID
        },
        // left join that catches if the bride's father is a member
        {
          type: 'leftJoin',
          tableName: { groom_father_member: db.tables.MEMBER_TABLE },
          sourceCol: 'groom_father.' + personFields.MEMBER,
          destCol: 'groom_father_member.' + memberFields.ID
        }
      ]
      // columns to be retrieved
      const columns = [
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.ID + ' as wedding_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.COUPLE + ' as couple_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE + ' as date',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE_OF_WEDDING + ' as wedding_date',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.BRIDE_PARENTS + ' as bride_parents_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.GROOM_PARENTS + ' as groom_parents_id',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.LOCATION + ' as location',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.SOLEMNIZER + ' as solemnizer',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.WEDDING_OFFICIANT + ' as officiant',
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.CONTRACT + ' as contract_no',
        // bride's name
        'bride.' + personFields.FIRST_NAME + ' as bride_first_name',
        'bride.' + personFields.MID_NAME + ' as bride_mid_name',
        'bride.' + personFields.LAST_NAME + ' as bride_last_name',
        'bride.' + personFields.MEMBER + ' as bride_member_id',
        'bride.' + personFields.ID + ' as bride_person_id',
        // groom's name
        'groom.' + personFields.FIRST_NAME + ' as groom_first_name',
        'groom.' + personFields.MID_NAME + ' as groom_mid_name',
        'groom.' + personFields.LAST_NAME + ' as groom_last_name',
        'groom.' + personFields.MEMBER + ' as groom_member_id',
        'groom.' + personFields.ID + ' as groom_person_id',
        // name of the bride's mother
        'bride_mother.' + personFields.FIRST_NAME + ' as bride_mother_first_name',
        'bride_mother.' + personFields.MID_NAME + ' as bride_mother_mid_name',
        'bride_mother.' + personFields.LAST_NAME + ' as bride_mother_last_name',
        'bride_mother.' + personFields.MEMBER + ' as bride_mother_member_id',
        'bride_mother.' + personFields.ID + ' as bride_mother_person_id',
        // name of the bride's father
        'bride_father.' + personFields.FIRST_NAME + ' as bride_father_first_name',
        'bride_father.' + personFields.MID_NAME + ' as bride_father_mid_name',
        'bride_father.' + personFields.LAST_NAME + ' as bride_father_last_name',
        'bride_father.' + personFields.MEMBER + ' as bride_father_member_id',
        'bride_father.' + personFields.ID + ' as bride_father_person_id',
        // name of the groom's mother
        'groom_mother.' + personFields.FIRST_NAME + ' as groom_mother_first_name',
        'groom_mother.' + personFields.MID_NAME + ' as groom_mother_mid_name',
        'groom_mother.' + personFields.LAST_NAME + ' as groom_mother_last_name',
        'groom_mother.' + personFields.MEMBER + ' as groom_mother_member_id',
        'groom_mother.' + personFields.ID + ' as groom_mother_person_id',
        // name of the groom's father
        'groom_father.' + personFields.FIRST_NAME + ' as groom_father_first_name',
        'groom_father.' + personFields.MID_NAME + ' as groom_father_mid_name',
        'groom_father.' + personFields.LAST_NAME + ' as groom_father_last_name',
        'groom_father.' + personFields.MEMBER + ' as groom_father_member_id',
        'groom_father.' + personFields.ID + ' as groom_father_person_id'
      ]
      // set the WHERE condition: wedding_id = <weddingId>
      const cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.WEDDING_TABLE + '.' + weddingRegFields.ID, weddingId)

      const witnessJoin = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      const witnessColumns = [
        db.tables.WITNESS_TABLE + '.' + witnessFields.DEDICATION + ' as dedication_id',
        db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON + ' as witness_person_id',
        db.tables.WITNESS_TABLE + '.' + witnessFields.ID + ' as witness_id',
        db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as witness_member_id',
        db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as witness_first_name',
        db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as witness_mid_name',
        db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as witness_last_name',
        db.tables.WITNESS_TABLE + '.' + witnessFields.TYPE + ' as type'
      ]

      // set the WHERE condition: wedding_id = <weddingId>
      const witnessCond = new Condition(queryTypes.where)
      witnessCond.setKeyValue(db.tables.WITNESS_TABLE + '.' + witnessFields.WEDDING, weddingId)
      console.log(cond)

      // find them
      db.find(db.tables.WEDDING_TABLE, cond, joinTables, columns, function (result) {
        // store to data\
        console.log(result)
        if (result !== null && result.length > 0) {
          console.log(result)
          const data = {
            ...result[0]
          }
          data.canSee = (parseInt(req.session.weddingId) === parseInt(weddingId)) || (parseInt(req.session.level) >= 2)
          if ((parseInt(req.session.level) <= 2)) {
            data.canSee = false
          }
          data.styles = ['forms']
          data.scripts = ['editWedding']
          data.backLink = parseInt(req.session.level) >= 2 ? '/wedding_main_page' : '/forms_main_page'
          db.find(db.tables.WITNESS_TABLE, witnessCond, witnessJoin, witnessColumns, function (result) {
            if (result) {
              data.witnesses = result
              // Filters all Godfathers
              data.witnessMale = data.witnesses.filter((witness) => { return witness.type === 'Godfather' })
              // Filters all Godmothers
              data.witnessFemale = data.witnesses.filter((witness) => { return witness.type === 'Godmother' })
              console.log(data)
              db.find(db.tables.MEMBER_TABLE, [], {
                tableName: tables.PERSON_TABLE, 
                sourceCol: tables.PERSON_TABLE + '.' + personFields.ID,
                destCol: tables.MEMBER_TABLE + '.' + memberFields.PERSON
              }, '*', function (result) {
                if (result) {
                  data.males = result.filter(elem => elem[memberFields.SEX] === 'Male')
                  data.females = result.filter(elem => elem[memberFields.SEX] === 'Female')
                  res.render('edit-wedding', data)
                } else {
                  sendError(req, res, 404, '404 Wedding Record Not Found')
                }
              })
            }
          })
        } else {
          sendError(req, res, 404, '404 Wedding Record Not Found')
        }
      })
    } else {
      sendError(req, res, 401)
    }
  },

  /**
  * This function inserts a new row in the wedding table
  * @param req - the incoming request containing either the query or body
  * @param res - the result to be sent out after processing the request
  */
  postAddWedding: function (req, res) {
    const data = {}

    const people = {
      bride: null,
      groom: null,
      brideMother: null,
      brideFather: null,
      groomMother: null,
      groomFather: null
    }
    const couples = {
      couple: {},
      brideParents: {},
      groomParents: {}
    }

    const peopleOffsets = {
      bride: 0,
      groom: 0,
      brideMother: 0,
      brideFather: 0,
      groomMother: 0,
      groomFather: 0
    }

    const coupleOffsets = {
      brideParents: 0,
      groomParents: 0
    }

    const peopleInfo = []
    const coupleInfo = []

    // Extract data from req.body
    console.log(req.body)
    people.bride = JSON.parse(req.body.bride)
    people.groom = JSON.parse(req.body.groom)
    people.brideMother = JSON.parse(req.body.brideMother)
    people.brideFather = JSON.parse(req.body.brideFather)
    people.groomMother = JSON.parse(req.body.groomMother)
    people.groomFather = JSON.parse(req.body.groomFather)
    people.witnessMale = JSON.parse(req.body.witnessMale)
    people.witnessFemale = JSON.parse(req.body.witnessFemale)
    data[weddingRegFields.CONTRACT] = req.body.contract
    data[weddingRegFields.DATE_OF_WEDDING] = req.body.weddingDate
    data[weddingRegFields.DATE] = req.body.date
    data[weddingRegFields.LOCATION] = req.body.location
    data[weddingRegFields.SOLEMNIZER] = req.body.solemnizer
    data[weddingRegFields.WEDDING_OFFICIANT] = req.body.officiant

    console.log(people)

    if (people.bride.isMember) {
      couples.couple[coupleFields.FEMALE] = people.bride.person_id
    } else {
      const bride = {}
      bride[personFields.FIRST_NAME] = people.bride.first_name
      bride[personFields.MID_NAME] = people.bride.mid_name
      bride[personFields.LAST_NAME] = people.bride.last_name

      peopleInfo.push(bride)
    }

    if (people.groom.isMember) {
      couples.couple[coupleFields.MALE] = people.groom.person_id
    } else {
      const groom = {}
      groom[personFields.FIRST_NAME] = people.groom.first_name
      groom[personFields.MID_NAME] = people.groom.mid_name
      groom[personFields.LAST_NAME] = people.groom.last_name

      peopleInfo.push(groom)

      peopleOffsets.bride += 1
    }

    // check Bride Parents
    if (people.brideMother !== null && people.brideMother.isMember) {
      couples.brideParents[coupleFields.FEMALE] = people.brideMother.person_id
    } else if (people.brideMother !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.brideMother.first_name
      parent[personFields.MID_NAME] = people.brideMother.mid_name
      parent[personFields.LAST_NAME] = people.brideMother.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
    }

    if (people.brideFather !== null && people.brideFather.isMember) {
      couples.brideParents[coupleFields.MALE] = people.brideFather.person_id
    } else if (people.brideFather !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.brideFather.first_name
      parent[personFields.MID_NAME] = people.brideFather.mid_name
      parent[personFields.LAST_NAME] = people.brideFather.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
      peopleOffsets.brideMother += 1
    }

    // Check Groom Parents

    if (people.groomMother !== null && people.groomMother.isMember) {
      couples.groomParents[coupleFields.FEMALE] = people.groomMother.person_id
    } else if (people.groomMother !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.groomMother.first_name
      parent[personFields.MID_NAME] = people.groomMother.mid_name
      parent[personFields.LAST_NAME] = people.groomMother.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
      peopleOffsets.brideMother += 1
      peopleOffsets.brideFather += 1
    }

    if (people.groomFather !== null && people.groomFather.isMember) {
      couples.groomParents[coupleFields.MALE] = people.groomFather.person_id
    } else if (people.groomFather !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.groomFather.first_name
      parent[personFields.MID_NAME] = people.groomFather.mid_name
      parent[personFields.LAST_NAME] = people.groomFather.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
      peopleOffsets.brideMother += 1
      peopleOffsets.brideFather += 1
      peopleOffsets.groomMother += 1
    }

    console.log(peopleInfo)
    console.log(peopleOffsets)
    db.insert(db.tables.PERSON_TABLE, peopleInfo, function (result) {
      if (result) {
        result = result[0]

        if (!people.bride.isMember) {
          couples.couple[coupleFields.FEMALE] = result - peopleOffsets.bride
        }

        if (!people.groom.isMember) {
          couples.couple[coupleFields.MALE] = result - peopleOffsets.groom
        }

        if (people.brideMother !== null && !people.brideMother.isMember) {
          couples.brideParents[coupleFields.FEMALE] = result - peopleOffsets.brideMother
        }

        if (people.brideFather !== null && !people.brideFather.isMember) {
          couples.brideParents[coupleFields.MALE] = result - peopleOffsets.brideFather
        }

        if (people.groomMother !== null && !people.groomMother.isMember) {
          couples.groomParents[coupleFields.FEMALE] = result - peopleOffsets.groomMother
        }

        if (people.groomFather !== null && !people.groomFather.isMember) {
          couples.groomParents[coupleFields.MALE] = result - peopleOffsets.groomFather
        }

        if (people.brideMother !== null || people.brideFather !== null) {
          coupleInfo.push(couples.brideParents)
        }

        if (people.groomMother !== null || people.groomFather !== null) {
          coupleInfo.push(couples.groomParents)
          coupleOffsets.brideParents += 1
        }

        coupleInfo.push(couples.couple)
        coupleOffsets.brideParents += 1
        coupleOffsets.groomParents += 1

        db.insert(db.tables.COUPLE_TABLE, coupleInfo, function (result) {
          if (result) {
            result = result[0]
            if (people.brideMother !== null || people.brideFather !== null) {
              data[weddingRegFields.BRIDE_PARENTS] = result - coupleOffsets.brideParents
            }
            if (people.groomMother !== null || people.groomFather !== null) {
              data[weddingRegFields.GROOM_PARENTS] = result - coupleOffsets.groomParents
            }
            data[weddingRegFields.COUPLE] = result

            db.insert(db.tables.WEDDING_TABLE, data, function (result) {
              if (result) {
                const currWedding = result[0]

                const witnessMaleInfo = []
                const witnessFemaleInfo = []
                const witnesses = []

                people.witnessMale.forEach(function (witness) {
                  const currWitness = {}
                  if (witness.isMember) {
                    currWitness[witnessFields.TYPE] = 'Godfather' // Change
                    currWitness[witnessFields.WEDDING] = currWedding
                    currWitness[witnessFields.PERSON] = witness.person_id
                    witnesses.push(currWitness)
                  } else { // For every non-member witness, add to witnessInfo to insert to people table
                    currWitness[personFields.FIRST_NAME] = witness.first_name
                    currWitness[personFields.MID_NAME] = witness.mid_name
                    currWitness[personFields.LAST_NAME] = witness.last_name

                    witnessMaleInfo.push(currWitness)
                  }
                })

                people.witnessFemale.forEach(function (witness) {
                  const currWitness = {}
                  if (witness.isMember) {
                    currWitness[witnessFields.TYPE] = 'Godmother' // Change
                    currWitness[witnessFields.WEDDING] = currWedding
                    currWitness[witnessFields.PERSON] = witness.person_id
                    witnesses.push(currWitness)
                  } else { // For every non-member witness, add to witnessInfo to insert to people table
                    currWitness[personFields.FIRST_NAME] = witness.first_name
                    currWitness[personFields.MID_NAME] = witness.mid_name
                    currWitness[personFields.LAST_NAME] = witness.last_name

                    witnessFemaleInfo.push(currWitness)
                  }
                })

                db.insert(db.tables.PERSON_TABLE, witnessMaleInfo, function (result) {
                  if (result) {
                    result = result[0]

                    const maleWitnesses = witnessMaleInfo.map(function (witness) {
                      const witnessInfo = {}
                      witnessInfo[witnessFields.WEDDING] = currWedding
                      witnessInfo[witnessFields.PERSON] = result
                      witnessInfo[witnessFields.TYPE] = 'Godfather' // Change
                      result -= 1

                      return witnessInfo
                    })

                    db.insert(db.tables.PERSON_TABLE, witnessFemaleInfo, function (result) {
                      if (result) {
                        result = result[0]

                        const femaleWitnesses = witnessFemaleInfo.map(function (witness) {
                          const witnessInfo = {}
                          witnessInfo[witnessFields.WEDDING] = currWedding
                          witnessInfo[witnessFields.PERSON] = result
                          witnessInfo[witnessFields.TYPE] = 'Godmother'
                          result -= 1

                          return witnessInfo
                        })

                        const allWitnesses = witnesses.concat(maleWitnesses).concat(femaleWitnesses)

                        // Insert to witness table
                        db.insert(db.tables.WITNESS_TABLE, allWitnesses, function (result) {
                          if (result) {
                            const memberUpdateData = {}
                            memberUpdateData[memberFields.WEDDING_REG] = currWedding
                            const updateConditions = []

                            if (people.bride.isMember) {
                              const condition = new Condition(queryTypes.where)
                              condition.setKeyValue(memberFields.ID, people.bride.member_id)
                              updateConditions.push(condition)
                            }

                            if (people.groom.isMember) {
                              let condition

                              if (updateConditions.length > 0) {
                                condition = new Condition(queryTypes.orWhere)
                              } else {
                                condition = new Condition(queryTypes.where)
                              }
                              condition.setKeyValue(memberFields.ID, people.groom.member_id)
                              updateConditions.push(condition)
                            }

                            if (updateConditions.length === 0) {
                              const condition = new Condition(queryTypes.whereNull)
                              condition.setField(memberFields.ID)
                              updateConditions.push(condition)
                            }

                            db.update(db.tables.MEMBER_TABLE, memberUpdateData, updateConditions, function (result) {
                              console.log(result)
                              if (result === 0) {
                                result = true
                              }

                              if (result) {
                                req.session.editId = currWedding
                                console.log(currWedding)
                                res.send(JSON.stringify(currWedding))
                              } else {
                                console.log('error updating into member table')
                                res.send(false)
                              }
                            })
                          } else {
                            console.log('error adding into witnesses table')
                            res.send(false)
                          }
                        })
                      } else {
                        console.log('error adding ninang')
                        res.send(false)
                      }
                    })
                  } else {
                    console.log('error adding ninong')
                    res.send(false)
                  }
                })
              } else {
                console.log('error adding into wedding table')
                res.send(false)
              }
            })
          } else {
            console.log('error adding couple')
            res.send(false)
          }
        })
      } else {
        console.log('error adding people')
        res.send(false)
      }
    })
  },

  /**
   * This function updates a row in the wedding table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  updateWedding: function (req, res) {
    const data = req.query.data
    const condition = req.query.condition

    db.update(db.tables.MEMBER_TABLE, data, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  },
  /**
   * This function deletes a row in the wedding table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  deleteWedding: function (req, res) {
    const condition = req.query.condition

    db.update(db.tables.MEMBER_TABLE, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  }
}

module.exports = weddingController
