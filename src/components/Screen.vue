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
            <input
              type="date"
              name="birthday"
              :max="maxDate()"
              v-model="item.DateOfBirth"
            />
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
    maxDate() {
      return new Date().toISOString().split('T')[0]
    },
    update() {
      this.getData()
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
    salaryFormat(value) {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    },
    async getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/Record/GetRecords`,
        )
        if (response.status === 200 && response.data.Success === true) {
          if (this.verifyAPIData(response.data.Data) === false) {
            return
          }
          this.personData = response.data.Data.map(item => {
            return {
              Name: item.Name,
              DateOfBirth: item.DateOfBirth.split('T')[0],
              Salary: item.Salary,
              Address: item.Address,
            }
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
    verifyAPIData(data) {
      if (!Array.isArray(data)) {
        alert('API 回傳資料需為陣列')
        return false
      }
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (typeof item.Name !== 'string') {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Name 需為字串`)
          return false
        }
        if (item.Name.trim() === '') {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Name 不得為空白`)
          return false
        }
        if (typeof item.DateOfBirth !== 'string') {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Birthday 需為字串`)
          return false
        }
        if (item.DateOfBirth.trim() === '') {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Birthday 不得為空白`)
          return false
        }

        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?(Z)?$/
        if (!isoRegex.test(item.DateOfBirth)) {
          alert(
            `第 ${i + 1} (index:${i}) 筆資料 Birthday 格式需為 YYYY-MM-DDTHH:MM:SS 或 YYYY-MM-DDTHH:MM:SS.sss`,
          )
          return false
        }
        const date = new Date(item.DateOfBirth)
        const getTime = date.getTime()
        if (isNaN(getTime)) {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Birthday 需為真實存在日期`)
          return false
        }
        if (getTime > new Date().getTime()) {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Birthday 需為現在到過去的日期`)
          return false
        }
        if (typeof item.Salary !== 'number') {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Salary 需為數字`)
          return false
        }
        if (item.Salary < 0 || item.Salary > 100000) {
          alert(
            `第 ${i + 1} (index:${i}) 筆資料 Salary 需介於 0 ~ 100,000 之間`,
          )
          return false
        }
        if (typeof item.Address !== 'string') {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Address 需為字串`)
          return false
        }
        if (item.Address.trim() === '') {
          alert(`第 ${i + 1} (index:${i}) 筆資料 Address 不得為空白`)
          return false
        }
      }
      return true
    },

    verifyInputData() {
      if (!Array.isArray(this.personData)) {
        alert('this.personData 需為陣列')
        return false
      }
      for (let i = 0; i < this.personData.length; i++) {
        const item = this.personData[i]
        if (item.Name.trim() === '') {
          alert(`第 ${i + 1} 筆資料 Name 不得為空白`)
          return false
        }
        if (item.DateOfBirth.trim() === '') {
          alert(`第 ${i + 1} 筆資料 Birthday 不得為空白`)
          return false
        }
        if (item.Address.trim() === '') {
          alert(`第 ${i + 1} 筆資料 Address 不得為空白`)
          return false
        }
      }
      return true
    },
    checkName() {
      const nameSet = new Set()
      return this.personData.some(item => {
        if (nameSet.has(item.Name)) {
          alert(`Name 重複`)
          return true // 找到第一個重複即終止
        }
        nameSet.add(item.Name)
        return false
      })
    },

    async save() {
      // 驗證資料
      if (this.verifyInputData() === false || this.checkName() === true) {
        return
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/Record/SaveRecords`,
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
