<template>
  <main class="wrap">
    <section class="btnBox">
      <div><button @click="add" type="button" class="blueBtn">Add</button></div>
      <div>
        <button @click="save" type="button" class="greenBtn">Save</button>
      </div>
      <div>
        <button @click="update" type="button" class="redBtn">Update</button>
      </div>
    </section>
    <table class="">
      <thead>
        <tr>
          <th class="head">Name</th>
          <th class="head">Birthday</th>
          <th class="head">Salary</th>
          <th class="head">Address</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in personData" :key="index">
          <td>
            <input type="text" name="name" v-model.trim="item.Name" />
          </td>
          <td>
            <input type="date" name="birthday" v-model="item.DateOfBirth" />
          </td>
          <td>
            <div class="salaryBox">
              <input
                class="salaryInput"
                type="range"
                name="salary"
                min="0"
                max="100000"
                v-model.number="item.Salary"
              />
              <span class="salaryNum"> $ {{ salaryFormat(item.Salary) }} </span>
            </div>
          </td>
          <td>
            <input type="text" name="address" v-model.trim="item.Address" />
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      personData: [],
      errorMsg: '',
    }
  },
  methods: {
    update() {
      this.getData()
    },
    salaryFormat(value) {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    },
    async getData() {
      try {
        const response = await axios.get(
          'http://nexifytw.mynetgear.com:45000/api/Record/GetRecords',
        )
        if (response.status === 200 && response.data.Success === true) {
          this.personData = response.data.Data.map(item => {
            if (item.DateOfBirth) {
              item.DateOfBirth = item.DateOfBirth.split('T')[0]
            }
            return item
          })
          alert('成功取得最新資料')
        } else {
          alert('未知錯誤')
        }
      } catch (error) {
        this.errorMsg = error.message
        alert(this.errorMsg)
      }
    },
    add() {
      const newPerson = {
        Name: '',
        DateOfBirth: '',
        Salary: 0,
        Address: '',
      }
      this.personData.splice(0, 0, newPerson)
    },
    verify() {
      if (!Array.isArray(this.personData)) {
        alert('this.personData 需為陣列')
        return false
      }

      for (let i = 0; i < this.personData.length; i++) {
        const item = this.personData[i]
        if (typeof item.Name !== 'string') {
          alert('Name 需為字串')
          return false
        }
        if (item.Name.trim() === '') {
          alert('Name 不得為空白')
          return false
        }
        if (item.DateOfBirth.trim() === '') {
          alert('Birthday 不得為空白')
          return false
        }
        if (typeof item.Salary !== 'number') {
          alert('Salary 需為數字')
          return false
        }
        if (typeof item.Address !== 'string') {
          alert('Address 需為字串')
          return false
        }
        if (item.Address.trim() === '') {
          alert('Address 不得為空白')
          return false
        }
      }
      return true
    },
    async save() {
      // 驗證資料
      if (this.verify() === false) {
        return
      }
      try {
        const res = await axios.post(
          'http://nexifytw.mynetgear.com:45000/api/Record/SaveRecords',
          this.personData,
        )
        if (res.status === 200 && res.data.Success === true) {
          alert('儲存成功')
          this.getData()
        } else {
          alert('未知錯誤')
        }
      } catch (error) {
        this.errorMsg = error.message
        alert(this.errorMsg)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  border-radius: 10%;
  padding: 11px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  filter: brightness(1.2);
}

table {
  width: 100%;
  border-collapse: collapse;
}

td,
th {
  padding: 6px 10px;
  border-bottom: 1px solid #e4e3e6;
}

input {
  width: 70%;
  padding: 7px 4px;
  border-radius: 3px;
  border: 1px solid #777777;
  font-size: 16px;
}

.wrap {
  margin: 50px auto;
  width: 80%;
}

.btnBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.blueBtn {
  background-color: #0868f9;
}

.greenBtn {
  background-color: #1b7b4b;
}

.redBtn {
  background-color: #d72d3d;
}

.head {
  text-align: left;
  padding-bottom: 12px;
}

.salaryBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.salaryNum {
  width: 70px;
  color: #0868f9;
  position: relative;
  font-size: 14px;
  font-weight: bold;
  padding: 0px;
  margin: 0px;
}
</style>
