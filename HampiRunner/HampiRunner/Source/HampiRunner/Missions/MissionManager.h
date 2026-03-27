#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MissionDef.h"
#include "MissionManager.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnMissionUpdated, UMissionDef*, Mission, const FMissionStage&, Stage);

UCLASS()
class HAMPIRUNNER_API AMissionManager : public AActor
{
	GENERATED_BODY()

public:
	AMissionManager();
	virtual void Tick(float DeltaSeconds) override;

	UFUNCTION(BlueprintCallable)
	void StartMission(UMissionDef* Mission);

	UFUNCTION(BlueprintCallable)
	void CompleteCurrentStage();

	UFUNCTION(BlueprintCallable)
	void FailMission();

	UPROPERTY(BlueprintAssignable)
	FOnMissionUpdated OnMissionStarted;

	UPROPERTY(BlueprintAssignable)
	FOnMissionUpdated OnStageChanged;

protected:
	virtual void BeginPlay() override;

	UPROPERTY(EditAnywhere, Category="Mission")
	TArray<TObjectPtr<UMissionDef>> AvailableMissions;

	UPROPERTY(VisibleInstanceOnly, Category="Mission")
	TObjectPtr<UMissionDef> CurrentMission;

	int32 CurrentStageIndex = INDEX_NONE;
	float StageTimeRemaining = 0.f;
};
