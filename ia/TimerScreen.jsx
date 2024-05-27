import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView,TextInput } from 'react-native';
import { Calendar, WeekCalendar } from 'react-native-calendars';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import * as Location from 'expo-location';

Location.setGoogleApiKey("AIzaSyD5GUOMMrDY5Ml8JOQ5j7z7p9f8GaGCDBg");



export default function TimerScreen() {



  const data = [
    { label: 'Adventure', value: '1' },
    { label: 'Tourism', value: '2' },
    { label: 'Hiking', value: '3' },
    { label: 'Cultural', value: '4' },
    { label: 'Shopping', value: '5' },
    { label: 'wildLife', value: '6' },
  
  ];

  let [fontsLoaded] = useFonts({
    'Outfit': require('../../assets/fonts/Outfit-VariableFont_wght.ttf'),
  });
  const [showMonthView, setShowMonthView] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [open,setOpen]=useState(false)
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [startTime, setStartTime] = useState({ hour: '0', minute: '0', period: 'AM' });
  const [endTime, setEndTime] = useState({ hour: '0', minute: '0', period: 'AM' });
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState(null);
  const [Data, setDate] = useState(null);


  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location:");
      console.log(currentLocation);

      // Send location data to your Node.js server
      fetch('http://192.168.1.17:3000/receive-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentLocation),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response from server:', data);
        // Handle response from server if needed
      })
      .catch(error => {
        console.error('Error sending location data to server:', error);
      });
    };
    getPermissions();
  }, [Data]);




 

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <></>
      );
    }
    return null;
  };

  const toggleStartPeriod = () => {
    setStartTime({
      ...startTime,
      period: startTime.period === 'AM' ? 'PM' : 'AM',
    });
  };
  const items = ["ads", "bnj", "hmd"];

  // Function to toggle AM/PM for end time
  const toggleEndPeriod = () => {
    setEndTime({
      ...endTime,
      period: endTime.period === 'AM' ? 'PM' : 'AM',
    });
  };
  


   

  const renderDateRange = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
    const currentYear = currentDate.getFullYear();
    const currentDayOfWeek = currentDate.getDay();
  
    // Calculate the start date (Sunday) and end date (Saturday) of the current week
    const startDate = new Date(currentYear, currentDate.getMonth(), currentDay - currentDayOfWeek);
    const endDate = new Date(currentYear, currentDate.getMonth(), currentDay - currentDayOfWeek + 6);
  
    const startDateFormatted = startDate.getDate();
    const endDateFormatted = endDate.getDate();
    const endDateMonth = endDate.toLocaleString('default', { month: 'short' });
  
    return `${currentMonth} ${startDateFormatted} (${startDateFormatted}-${endDateFormatted})`;
  };
  const increaseStartHour = () => {
    const newHour = (startTime.hour + 1) % 12; // Increment start hour by 1, loop back to 0 after reaching 12
    setStartTime({ ...startTime, hour: newHour });
  };
  
  const decreaseStartHour = () => {
    const newHour = (startTime.hour - 1 + 12) % 12; // Decrement start hour by 1, loop back to 11 after reaching -1
    setStartTime({ ...startTime, hour: newHour });
  };
  
  const increaseStartMinute = () => {
    const newMinute = (startTime.minute + 1) % 60; // Increment start minute by 1, loop back to 0 after reaching 60
    setStartTime({ ...startTime, minute: newMinute });
  };
  
  const decreaseStartMinute = () => {
    const newMinute = (startTime.minute - 1 + 60) % 60; // Decrement start minute by 1, loop back to 59 after reaching -1
    setStartTime({ ...startTime, minute: newMinute });
  };
  
  const increaseEndHour = () => {
    const newHour = (endTime.hour + 1) % 12; // Increment end hour by 1, loop back to 0 after reaching 12
    setEndTime({ ...endTime, hour: newHour });
  };
  
  const decreaseEndHour = () => {
    const newHour = (endTime.hour - 1 + 12) % 12; // Decrement end hour by 1, loop back to 11 after reaching -1
    setEndTime({ ...endTime, hour: newHour });
  };
  
  const increaseEndMinute = () => {
    const newMinute = (endTime.minute + 1) % 60; // Increment end minute by 1, loop back to 0 after reaching 60
    setEndTime({ ...endTime, minute: newMinute });
  };
  
  const decreaseEndMinute = () => {
    const newMinute = (endTime.minute - 1 + 60) % 60; // Decrement end minute by 1, loop back to 59 after reaching -1
    setEndTime({ ...endTime, minute: newMinute });
  };
  
  
  const TimePickerSection = ({ label, time, togglePeriod, increaseHour, decreaseHour, increaseMinute, decreaseMinute }) => (
    <View style={styles.timeSection}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.timeDisplay}>
        
        <Text style={styles.timeText}>{time.hour <10 ? "0"+time.hour:time.hour}</Text>
        <TouchableOpacity style={styles.TopH} onPress={increaseHour}>
          <Image source={require("../../assets/images/upArrow.png")} style={styles.arrowT}/>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.BottomH} onPress={decreaseHour}>
          <Image source={require("../../assets/images/downArrow.png")} style={styles.arrowT}/>
        </TouchableOpacity>
        <Text style={styles.timeP}>:</Text>
        
        <Text style={styles.timeText}>{time.minute <10 ? "0"+time.minute:time.minute}</Text>
        <TouchableOpacity style={styles.TopM} onPress={increaseMinute}>
          <Image source={require("../../assets/images/upArrow.png")} style={styles.arrowT}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BottomM} onPress={decreaseMinute}>
          <Image source={require("../../assets/images/downArrow.png")} style={styles.arrowT}/>
        </TouchableOpacity>
        <View style={styles.AMPcontainer}>

          <TouchableOpacity
            style={[styles.periodButtonT, time.period === 'AM' && styles.selectedPeriod]}
            onPress={togglePeriod}
          >
            <Text style={[styles.periodText, time.period === 'AM' && styles.selectedPeriodText]}>AM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButtonB, time.period === 'PM' && styles.selectedPeriod]}
            onPress={togglePeriod}
          >

            <Text style={[styles.periodText, time.period === 'PM' && styles.selectedPeriodText]}>PM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  
  

  

  
  const renderDays = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
    return daysOfWeek.map((day, index) => {
      const dayNumber = currentDay + index;
      // Handle cases where dayNumber exceeds the number of days in the current month
      const adjustedDayNumber = dayNumber > daysInMonth ? dayNumber - daysInMonth : dayNumber;
  
      return (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayText}>{day}</Text>
          <TouchableOpacity>
            <Text style={styles.numText}>{adjustedDayNumber}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  };
  

  function handleOpen(){
    setOpen(!open)
  }
  function handleDone() {
    // Remove the marked dates from the calendar
    
  
    // Implement logic to save the selected period
    
   
  
    // Close the modal
    setOpen(false);
  }
   if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handlePress = () => {



    setDate({
      SelectedDate:selectedDate,
      startTime: `${startTime.hour}:${startTime.minute} ${startTime.period}`,
      endTime: `${endTime.hour}:${endTime.minute} ${endTime.period}`,
      budget:budget+"$",
      type: value,
    });
    console.log(Data)

    axios.post('http://192.168.1.17:3000/data', Data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  };

 

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => setShowMonthView(!showMonthView)}>
          <Image source={require("../../assets/images/arrow.png")} style={styles.arrow}/>
        </TouchableOpacity>
        <Text style={styles.editProfile}>Generate</Text>
      </View>
      <ScrollView>
      
      
      <View style={styles.calendarContainer}>
      <Text style={styles.text}>Date</Text>
        
        <View>
            <View style={styles.Calendar}></View>
            
        
        <View style={styles.pageContainer}>
       
        <TouchableOpacity  style={styles.arrowButton}>
          <Image source={require("../../assets/images/left-arrow.png")} style={styles.arrowLeft}/>
        </TouchableOpacity>
        
        <TouchableOpacity  style={styles.arrowButton}>
          <Image source={require("../../assets/images/right-arrow.png")} style={styles.arrowRight}/>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.arrowButton} onPress={handleOpen}>
          <Text style={styles.open}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.arrowButton}>
        <Text style={styles.date}>{renderDateRange()}</Text>
        </TouchableOpacity>
      </View>
      </View>
        
        
      </View>
      <View style={styles.weekContainer}>
        {renderDays()}
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={open}
      >
        <View style={styles.centredView}>
            <View style={styles.modalView}>
            <TouchableOpacity  style={styles.arrowButton} onPress={handleOpen}>
           
          <Calendar
            onDayPress={day => {
              setSelectedDate(day.dateString);
            }}
            markedDates={{
              [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
            }}
    />
          <Text style={styles.close}>close</Text>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                  <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </TouchableOpacity>
            </View>
        </View>

      </Modal>
      <View style={{marginBottom:40,}}>
      <Text style={styles.text}>Time</Text>
        
        
            <View style={styles.Time}></View>
            
            <View style={styles.containerDate}>
            <TimePickerSection
                label="Start"
                time={startTime}
                togglePeriod={toggleStartPeriod}
                increaseHour={increaseStartHour}
                decreaseHour={decreaseStartHour}
                increaseMinute={increaseStartMinute}
                decreaseMinute={decreaseStartMinute}
              />
              <TimePickerSection
                label="End"
                time={endTime}
                togglePeriod={toggleEndPeriod}
                increaseHour={increaseEndHour}
                decreaseHour={decreaseEndHour}
                increaseMinute={increaseEndMinute}
                decreaseMinute={decreaseEndMinute}
              />

            </View>
            
          
          
      </View>
      <Text style={styles.text}>Budget</Text>
      <View style={styles.budget}>
        <Text style={styles.dollar}> $</Text>
      <TextInput
        placeholder="Your Budget"
        style={styles.input}
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />
      </View>
      <Text style={styles.text}>Type</Text>
      <View style={styles.selection}>
      <View style={styles.containerS}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
        
          iconStyle={styles.iconStyle}
          data={data}
          
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.label);
            setIsFocus(false);
          }}
      
        />
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={handlePress}>
      <Text style={styles.resetButtonText}>Generate</Text>
    </TouchableOpacity>
</View>

      
      </ScrollView>

      
    </View>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#D7E5FF',
      
    },
    
    topContainer: {
        top:40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex:99,
      backgroundColor:"#D7E5FF",
      paddingTop:20,
     
    },
    pageContainer: {
        marginTop:20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      top:-110,
      left:15,
    },
    arrow: {
      width: 17,
      height: 30,
      left: -110,
      top: 2,
    },
    arrowLeft: {
        width: 17,
        height: 30,
        left:-150,
        top: -40,
      },
      arrowRight: {
        width: 17,
        height: 30,
        left:-140,
        top: -40,
      },
      arrowT:{
        width: 30,
        height: 30,
        top:-5,
        left:20,
        
      },
      open: {
        position:"absolute",
        left:80,
        top: -50,
        color:"#2164F3",
        fontSize:16,
      },
      date: {
        position:"absolute",
        left:-70,
        top: -50,
       
      },
    editProfile: {
      fontWeight: 'bold',
      fontSize: 20,
      left: -7
    },
    calendarContainer: {
      width: '100%',
    
      
      marginTop:70,
    },
    text:{
        marginBottom:20,
        fontSize:24,
        fontWeight:"bold",
        marginLeft:10,
        fontFamily:"Outfit"
    },
    Calendar:{
        width:320,
        height:157,
        backgroundColor:"white",
        borderRadius:20,
        alignSelf:"center"
    },
    Time:{
      width:320,
      height:300,
      backgroundColor:"white",
      borderRadius:20,
      alignSelf:"center"
  },
    weekContainer: {
        position:"absolute",
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 320,
        borderRadius: 20,
        paddingVertical: 20,
        top:190,
        left:20,
      },
      dayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      dayText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      dateText: {
        fontSize: 16,
        
      },
      numText:{
        fontSize: 16,
        marginTop:10,
      },
      centredView:{
        flex:1,
        justifyContent:'center',
        alignItems:"center",
        marginTop:22,
      },
      modalView:{
        margin:20,
        backgroundColor:"white",
        borderRadius:20,
        width:"90%",
        padding:35,
        alignItems:"center",
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:2,
        },
        shadowOpacity:0.25,
        shadowRadius:4,
        elevation:5,
      },
      close:{
        alignSelf:"center"
      },
      doneButton: {
        marginTop: 10,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
      },
      doneButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      timeSection: {
        marginBottom: 20,
      },
      label: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
        left:10,
      },
      containerDate: {
        left:50,
        bottom:-9,
        position:"absolute",
        
      },
      timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      TopH:{
        width:70,
        height:20,
        backgroundColor:"gray",
        position:"absolute",
        top:0,
        left:10,
        borderTopLeftRadius:2,
        borderTopRightRadius:2,
      },
      BottomH:{
        width:70,
        height:20,
        backgroundColor:"gray",
        position:"absolute",
        top:65,
        left:10,
        borderBottomLeftRadius:2,
        borderBottomRightRadius:2,
      },
      TopM:{
        width:70,
        height:20,
        backgroundColor:"gray",
        position:"absolute",
        top:0,
        left:108.7,
        borderTopLeftRadius:2,
        borderTopRightRadius:2,
      },
      BottomM:{
        width:70,
        height:20,
        backgroundColor:"gray",
        position:"absolute",
        top:65,
        left:108.7,
        borderBottomLeftRadius:2,
        borderBottomRightRadius:2,
      },
      timeText: {
        fontSize: 35,
        fontWeight: 'bold',
        marginHorizontal: 10,
        padding:15,
        backgroundColor:"#E9E9E9",
        borderRadius:2,
        color:"#1E1E1E"
      },
      timeP:{
        fontSize: 30,
        fontWeight: 'bold',
      },
      periodButtonT: {
        marginHorizontal: 5,
        width:60,
        height:42,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        alignItems:"center",
        
      },
      periodButtonB: {
        marginHorizontal: 5,
        width:60,
        height:42,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        alignItems:"center"
      },
      selectedPeriod: {
        backgroundColor: '#92CBFF',
        
      },
      periodText: {
        fontSize: 18,
        color:"#666666",
        bottom:-7,
      },
      selectedPeriodText:{
        fontSize: 18,
        color:"#2111AD"
      },
      input: {
        width: 270,
        height: 60,
        backgroundColor: 'white',
        borderBottomRightRadius:17,
        borderTopRightRadius:17,
        paddingLeft: 20,
       
        
        color: '#000',
        fontSize: 16,
        
      },
      resetButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#6C21DC",
        left:30,
        borderRadius: 5,
        width: 300,
        height: 60,
        paddingLeft: 20,
        marginTop:30,
        marginBottom: 20,
        color: '#000',
        fontSize: 16,
       
      },
      resetButtonText: {
        fontSize:20 ,
        
        color: "#FFFFFF",
        paddingRight:10,
      },
      budget:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        marginBottom:40,
        marginLeft:20,
      },
      dollar:{
        width:50,
        height:60,
        backgroundColor:"#F9F8F8",
        borderBottomLeftRadius:17,
        borderTopLeftRadius:17,
        textAlign:"center",
        paddingTop:10,
        fontSize:28,
      },
      containerS: {
        
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
      },
      dropdown: {
        height: 60,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 17,
        paddingHorizontal: 20,
        backgroundColor:"white",
        borderWidth:0,
        
      },
      icon: {
        marginRight: 5,
      },
      label2: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
    
       
    
  });