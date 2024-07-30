// src/screens/Create/create_8.tsx
//제목 추천 화면 추가

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const imageSource = require('../../img/Create/Create8-1_image.png');
const initialImageSource = require('../../img/Create/Create8-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 제목을 가져오기
const fetchRecommendedTitle = async (concept: string, topic: string, character: string, plot: string, novel: string) => {
  // AI 또는 서버에서 추천받은 제목을 비동기적으로 가져옴
  // 이 부분을 실제 AI API 호출로 대체
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('새로운 AI 추천 제목');
    }, 1000); // 1초 후에 소설 반환
  });
};

const Create_8 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params;  //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");
  const [okayButtonColor, setOkayButtonColor] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // 저장된 데이터 변수
  const [savedConcept, setSavedConcept] = useState('');
  const [savedTopic, setSavedTopic] = useState('');
  const [savedCharacter, setSavedCharacter] = useState('');
  const [savedPlot, setSavedPlot] = useState('');
  const [savedNovel, setSavedNovel] = useState('');

  //입력한 컨셉과 선택한 컨셉 상태 변수
  const [title, setTitle] = useState('');
  const [recommendedTitle, setRecommendedTitle] = useState('추천 받은 제목');
  const [isTextSelected, setIsTextSelected] = useState(false); // 상태 변수 추가

  // 최초 화면 상태 변수
  const [buttonText, setButtonText] = useState("제목을 추천받고 싶어요");
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState('지금까지의 정보들을 바탕으로\n소설과 어울리는 제목을 추천합니다!');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 앞에서 저장된 데이터 호출
        const concept = await AsyncStorage.getItem(`novelConcept_${novelId}`);
        const topic = await AsyncStorage.getItem(`novelTopic_${novelId}`);
        const character = await AsyncStorage.getItem(`novelCharacter_${novelId}`)
        const plot = await AsyncStorage.getItem(`novelPlot_${novelId}`)
        const novel = await AsyncStorage.getItem(`finalNovel_${novelId}`)

        if (concept !== null) {
          setSavedConcept(concept);
          // AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Concept:', concept);
        }

        if (topic !== null) {
          setSavedTopic(topic);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Topic:', topic);
        }

        if (character !== null) {
          setSavedCharacter(character);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Character:', character);
        }

        if (plot !== null) {
          setSavedPlot(plot);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Plot:', plot);
        }

        if (novel !== null) {
          setSavedNovel(novel);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Novel:', novel);
        }
      } catch (error) {
          console.error('Failed to load data.', error);
      }
    };

    fetchData();
  }, [novelId]);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = async () => {
    setButtonColor1("#000000");
    setTimeout(async () => {
      setButtonColor1("#9B9AFF");

      // 저장된 데이터를 사용하여 AI로부터 추천 받은 제목을 가져옴
      try {
        const newRecommendedTitle = await fetchRecommendedTitle(savedConcept, savedTopic, savedCharacter, savedPlot, savedNovel);
        setRecommendedTitle(newRecommendedTitle);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended title.', error);
      }
    }, 50); // 버튼 색상 복구
  };

  // 두 번째 버튼 색상 변경 함수
  const handlePressButton2 = () => {
    setButtonColor2("#000000");
    setTimeout(() => {
      setButtonColor2("#9B9AFF");
      setIsModalVisible2(true);
    }, 50); // 버튼 색상 복구
  };

  const onPressModalClose1 = () => {
    setIsModalVisible1(false);

    // 다시 추천받기 버튼, 이미지, 텍스트로 변경
    setButtonText("제목을 다시 추천받고 싶어요");
    setImage(againImage);
    setBottomText('추천받은 제목이 마음에 들지 않는다면\n제목을 다시 추천해드릴 수 있습니다\n창작자가 제목을 직접 작성할 수도 있습니다');
  }

  const onPressModalClose2 = async () => {
    //입력한 제목 저장
    try {
      await AsyncStorage.setItem(`novelTitle_${novelId}`, title); //id와 함께 저장
      setIsModalVisible2(false);
      navigation.navigate('Create_9', { novelId }); //id 전달
    } catch (e) {
      console.error('Failed to save title.', e);
    }
  }

  const onPressOkayButton = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      // 선택된 제목 저장
      try {
        if (isTextSelected) {
          await AsyncStorage.setItem(`novelTitle_${novelId}`, recommendedTitle); // id와 함께 저장
          setIsModalVisible1(false);
          navigation.navigate('Create_9', { novelId }); // id 전달
        } else {
          Alert.alert('경고','제목을 선택해주세요.');
        }
      } catch (e) {
        console.error('Failed to save title.', e);
      }
    }, 50); // 버튼 색상 복구
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  const handleTextPress = () => {
    setIsTextSelected((prev) => !prev); // 토글 기능
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'거의 다 왔습니다!\n소설의 제목을 추천해드릴게요!'}</Text>
        <Image source={image} style={styles.image}/>
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>제목을 직접 작성하고 싶어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <Pressable onPress={handleTextPress}>
              <Text style={[styles.modalTextStyle, { color: isTextSelected ? '#A2A2A2' : '#000000' }]}>
                {recommendedTitle}
              </Text>
            </Pressable>
            {/* 세번째 버튼 (추천 내용 확정) */}
            <TouchableOpacity style={[styles.okayButton, {backgroundColor: okayButtonColor}]} onPress={onPressOkayButton}>
              <Text style={styles.buttonText}>확정</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 두번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible2} transparent={true}>
        <View style={styles.modalBackground2}>
          <View style={styles.modalView2}>
            <Pressable style={styles.backButton} onPress={onPressBackButton}>
              <Image source={backButtonImage} />
            </Pressable>
            <Pressable style={styles.saveButton} onPress={onPressModalClose2}>
              <Text style={styles.saveButtonText}>저장</Text>
            </Pressable>
            <TextInput style={styles.textInput} placeholder="제목을 직접 작성해주세요" placeholderTextColor="#FFFFFF" maxLength={30} value={title} onChangeText={setTitle}/>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 40,
    color: '#000000',
    fontWeight: 'bold',
  },
  bottomText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
  },
  button: {
    bottom: 30,
    position: 'absolute',
    height: 60,
    width: '90%',
    borderRadius: 15,
    backgroundColor: "#9B9AFF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  modalBackground1: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalBackground2: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  modalView: {
    margin: 35,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  modalView2: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextStyle: {
    marginTop: 55,
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 7,
    left: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
  saveButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  okayButton: {
    bottom: 20,
    position: 'absolute',
    height: 40,
    width: '40%',
    borderRadius: 15,
    backgroundColor: "#9B9AFF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    borderColor: '#FFFFFF',
    borderBottomWidth: 5,
    width: '65%',
    padding: 6,
  },
});

export default Create_8;
